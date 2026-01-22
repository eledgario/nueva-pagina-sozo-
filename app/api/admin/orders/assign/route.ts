import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Assign agent to order
export async function POST(request: NextRequest) {
  try {
    // Verify admin password
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, agentId } = body;

    if (!orderId || !agentId) {
      return NextResponse.json(
        { error: 'Order ID and Agent ID are required' },
        { status: 400 }
      );
    }

    // Get current order data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, assigned_agent_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const oldAgentId = order.assigned_agent_id;

    // If there was a previous agent, decrement their count
    if (oldAgentId) {
      await supabase
        .from('profiles')
        .update({
          current_order_count: supabase.rpc('greatest', { a: 0, b: 'current_order_count - 1' }),
        })
        .eq('id', oldAgentId);

      // Simple decrement
      await supabase.rpc('decrement_order_count', { agent_id: oldAgentId });
    }

    // Update order with new agent
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        assigned_agent_id: agentId,
        assigned_at: new Date().toISOString(),
        status: order.status === 'paid' ? 'assigned' : order.status,
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Increment new agent's count
    await supabase
      .from('profiles')
      .update({
        current_order_count: supabase.rpc('least', {
          a: 'current_order_count + 1',
          b: 'max_concurrent_orders',
        }),
      })
      .eq('id', agentId);

    // Get agent details
    const { data: agent } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', agentId)
      .single();

    // Log event
    await supabase.from('order_events').insert({
      order_id: orderId,
      event_type: 'assigned',
      description: 'Order manually assigned to agent',
      old_value: { agent_id: oldAgentId },
      new_value: { agent_id: agentId },
    });

    // Create notification for agent
    await supabase.from('notifications').insert({
      user_id: agentId,
      order_id: orderId,
      type: 'order_assigned',
      title: 'Nuevo Proyecto Asignado',
      message: `Se te ha asignado la Orden #${order.order_number}. Revisa los detalles y contacta al cliente.`,
    });

    // Send email notification to agent
    if (agent?.email) {
      try {
        await resend.emails.send({
          from: 'Sozo <notifications@sozo.mx>',
          to: agent.email,
          subject: `Nuevo Proyecto Asignado: Orden #${order.order_number}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: #18181b; color: white; padding: 24px; border-radius: 16px; margin-bottom: 24px;">
                <h1 style="margin: 0; font-size: 24px; color: #FF007F;">SOZO</h1>
                <p style="margin: 8px 0 0; color: #FF007F; font-weight: 700;">NUEVO PROYECTO ASIGNADO</p>
              </div>

              <p>Hola ${agent.full_name || 'Agente'},</p>
              <p>Se te ha asignado un nuevo proyecto. Por favor contacta al cliente en las proximas 24 horas.</p>

              <div style="background: #f4f4f5; border-radius: 16px; padding: 24px; margin: 24px 0;">
                <h3 style="margin-top: 0;">Orden #${order.order_number}</h3>
                <p><strong>Cliente:</strong> ${order.customer_name}</p>
                <p><strong>Email:</strong> ${order.customer_email}</p>
                <p><strong>Cantidad:</strong> ${order.kit_quantity} kits</p>
                <p><strong>Total:</strong> $${(order.total_amount / 100).toLocaleString('es-MX')}</p>
              </div>

              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="display: inline-block; background: #FF007F; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700;">
                Ver Detalles en Dashboard
              </a>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send agent notification email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Agent assigned successfully',
      agent: agent
        ? {
            id: agent.id,
            name: agent.full_name,
            email: agent.email,
          }
        : null,
    });
  } catch (error) {
    console.error('Assign agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
