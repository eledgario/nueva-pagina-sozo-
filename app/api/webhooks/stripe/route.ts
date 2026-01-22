import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for webhooks
);

const resend = new Resend(process.env.RESEND_API_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  const metadata = session.metadata || {};

  // Parse items from metadata
  let items = [];
  try {
    items = JSON.parse(metadata.items || '[]');
  } catch {
    console.error('Failed to parse items from metadata');
  }

  // Extract customer info
  const customerEmail = session.customer_email || session.customer_details?.email || '';
  const customerName = session.customer_details?.name || metadata.customerName || '';
  const customerPhone = session.customer_details?.phone || '';
  const companyName = metadata.companyName || '';

  // Get shipping address
  const shippingAddress = session.shipping_details?.address
    ? {
        line1: session.shipping_details.address.line1,
        line2: session.shipping_details.address.line2,
        city: session.shipping_details.address.city,
        state: session.shipping_details.address.state,
        postal_code: session.shipping_details.address.postal_code,
        country: session.shipping_details.address.country,
        name: session.shipping_details.name,
      }
    : null;

  // Create order in Supabase
  const orderData = {
    customer_email: customerEmail,
    customer_name: customerName,
    customer_phone: customerPhone,
    company_name: companyName,
    items: items,
    packaging_type: metadata.packaging || 'kraft',
    kit_quantity: parseInt(metadata.kitQuantity || '1'),
    subtotal: parseInt(metadata.subtotal || '0'),
    discount_amount: parseInt(metadata.discount || '0'),
    discount_percent: parseFloat(metadata.discountPercent || '0'),
    tax_amount: parseInt(metadata.tax || '0'),
    total_amount: session.amount_total || parseInt(metadata.total || '0'),
    payment_status: session.payment_status === 'paid' ? 'paid' : 'pending',
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent as string,
    stripe_customer_id: session.customer as string,
    payment_method: session.payment_method_types?.[0] || 'card',
    paid_at: session.payment_status === 'paid' ? new Date().toISOString() : null,
    shipping_address: shippingAddress,
    status: session.payment_status === 'paid' ? 'paid' : 'pending',
    design_status: 'awaiting_files',
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    console.error('Failed to create order:', orderError);
    throw orderError;
  }

  console.log('Order created:', order.id);

  // Log order event
  await supabase.from('order_events').insert({
    order_id: order.id,
    event_type: 'created',
    description: 'Order created from Stripe checkout',
    new_value: { session_id: session.id, payment_status: session.payment_status },
  });

  // If payment is complete, auto-assign agent
  if (session.payment_status === 'paid') {
    await autoAssignAndNotify(order);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.succeeded:', paymentIntent.id);

  // Update order payment status
  const { data: order, error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      status: 'paid',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update order:', error);
    return;
  }

  if (order) {
    // Log event
    await supabase.from('order_events').insert({
      order_id: order.id,
      event_type: 'payment_succeeded',
      description: 'Payment confirmed',
      new_value: { payment_intent_id: paymentIntent.id },
    });

    // Auto-assign if not already assigned
    if (!order.assigned_agent_id) {
      await autoAssignAndNotify(order);
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.payment_failed:', paymentIntent.id);

  const { data: order, error } = await supabase
    .from('orders')
    .update({
      payment_status: 'failed',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .select()
    .single();

  if (order) {
    await supabase.from('order_events').insert({
      order_id: order.id,
      event_type: 'payment_failed',
      description: 'Payment failed',
      new_value: {
        error: paymentIntent.last_payment_error?.message,
      },
    });
  }
}

async function autoAssignAndNotify(order: {
  id: string;
  order_number: number;
  customer_email: string;
  customer_name: string;
  kit_quantity: number;
  total_amount: number;
}) {
  // Try to auto-assign using database function
  const { data: agentId, error: assignError } = await supabase.rpc(
    'auto_assign_order',
    { p_order_id: order.id }
  );

  let assignedAgent = null;

  if (agentId) {
    // Fetch agent details
    const { data: agent } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', agentId)
      .single();

    assignedAgent = agent;
  }

  // Send confirmation email to customer
  try {
    await resend.emails.send({
      from: 'Sozo <orders@sozo.mx>',
      to: order.customer_email,
      subject: `Orden #${order.order_number} Confirmada - Sozo`,
      html: generateOrderConfirmationEmail(order, assignedAgent),
    });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }

  // If agent assigned, send notification email to agent
  if (assignedAgent) {
    try {
      await resend.emails.send({
        from: 'Sozo <notifications@sozo.mx>',
        to: assignedAgent.email,
        subject: `Nuevo Proyecto Asignado: Orden #${order.order_number}`,
        html: generateAgentNotificationEmail(order, assignedAgent),
      });
    } catch (emailError) {
      console.error('Failed to send agent notification:', emailError);
    }
  }
}

function generateOrderConfirmationEmail(
  order: { order_number: number; customer_name: string; kit_quantity: number; total_amount: number },
  agent: { full_name: string; whatsapp_number?: string } | null
): string {
  const totalFormatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(order.total_amount / 100);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: 900; color: #FF007F; }
        .order-box { background: #f4f4f5; border-radius: 16px; padding: 24px; margin: 24px 0; }
        .order-number { font-size: 14px; color: #71717a; margin-bottom: 8px; }
        .order-title { font-size: 24px; font-weight: 700; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e4e4e7; }
        .detail-label { color: #71717a; }
        .detail-value { font-weight: 600; }
        .total-row { font-size: 18px; font-weight: 700; color: #FF007F; border-bottom: none; }
        .agent-card { background: linear-gradient(135deg, #FF007F 0%, #8b5cf6 100%); border-radius: 16px; padding: 24px; color: white; margin: 24px 0; }
        .agent-title { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
        .agent-name { font-size: 20px; font-weight: 700; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .guarantee { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 24px 0; }
        .guarantee-title { font-weight: 700; color: #92400e; }
        .footer { text-align: center; color: #71717a; font-size: 14px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SOZO</div>
          <p>Tu orden ha sido confirmada</p>
        </div>

        <p>Hola ${order.customer_name},</p>
        <p>Gracias por tu compra. Tu pago ha sido procesado exitosamente.</p>

        <div class="order-box">
          <div class="order-number">ORDEN #${order.order_number}</div>
          <div class="order-title">Pedido Confirmado</div>

          <div style="margin-top: 20px;">
            <div class="detail-row">
              <span class="detail-label">Cantidad de Kits</span>
              <span class="detail-value">${order.kit_quantity} kits</span>
            </div>
            <div class="detail-row total-row">
              <span>Total Pagado</span>
              <span>${totalFormatted}</span>
            </div>
          </div>
        </div>

        ${
          agent
            ? `
        <div class="agent-card">
          <div class="agent-title">TU PRODUCER ASIGNADO</div>
          <div class="agent-name">${agent.full_name}</div>
          <p style="margin: 8px 0 0; opacity: 0.9;">Te contactara en las proximas 24 horas para revisar el diseno de tu kit.</p>
          ${
            agent.whatsapp_number
              ? `<a href="https://wa.me/${agent.whatsapp_number}" class="whatsapp-btn">Contactar por WhatsApp</a>`
              : ''
          }
        </div>
        `
            : `
        <div class="order-box">
          <p style="margin: 0;"><strong>Siguiente paso:</strong> Un Producer de nuestro equipo sera asignado a tu proyecto y te contactara en menos de 24 horas.</p>
        </div>
        `
        }

        <div class="guarantee">
          <div class="guarantee-title">Garantia de Satisfaccion</div>
          <p style="margin: 8px 0 0; color: #92400e;">La produccion inicia unicamente despues de que apruebes el diseno final. Si no estas satisfecho, te devolvemos tu dinero.</p>
        </div>

        <div class="footer">
          <p>Sozo Corporate Labs</p>
          <p>Preguntas? Escribenos a hola@sozo.mx</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAgentNotificationEmail(
  order: { order_number: number; customer_name: string; customer_email: string; kit_quantity: number; total_amount: number },
  agent: { full_name: string }
): string {
  const totalFormatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(order.total_amount / 100);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { background: #18181b; color: white; padding: 24px; border-radius: 16px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 900; color: #FF007F; }
        .alert { color: #FF007F; font-weight: 700; margin-top: 8px; }
        .order-box { background: #f4f4f5; border-radius: 16px; padding: 24px; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .cta-btn { display: inline-block; background: #FF007F; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SOZO</div>
          <div class="alert">NUEVO PROYECTO ASIGNADO</div>
        </div>

        <p>Hola ${agent.full_name},</p>
        <p>Se te ha asignado un nuevo proyecto. Por favor contacta al cliente en las proximas 24 horas.</p>

        <div class="order-box">
          <h3 style="margin-top: 0;">Orden #${order.order_number}</h3>
          <div class="detail-row">
            <span>Cliente:</span>
            <strong>${order.customer_name}</strong>
          </div>
          <div class="detail-row">
            <span>Email:</span>
            <strong>${order.customer_email}</strong>
          </div>
          <div class="detail-row">
            <span>Cantidad:</span>
            <strong>${order.kit_quantity} kits</strong>
          </div>
          <div class="detail-row">
            <span>Total:</span>
            <strong style="color: #FF007F;">${totalFormatted}</strong>
          </div>
        </div>

        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" class="cta-btn">Ver Detalles en Dashboard</a>
      </div>
    </body>
    </html>
  `;
}
