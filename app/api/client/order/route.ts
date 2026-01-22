import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('order_number');

    let order = null;

    if (sessionId) {
      // Look up by Stripe session ID
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          assigned_agent:profiles!assigned_agent_id(
            id,
            full_name,
            avatar_url,
            whatsapp_number,
            email
          )
        `)
        .eq('stripe_checkout_session_id', sessionId)
        .single();

      if (error) {
        // If not found in DB, try to get from Stripe session
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);

          if (session.payment_status === 'paid') {
            // Order might not be in DB yet, return session info
            return NextResponse.json({
              order: {
                id: session.id,
                order_number: 0,
                status: 'paid',
                payment_status: session.payment_status,
                design_status: 'awaiting_files',
                customer_name: session.customer_details?.name || '',
                customer_email: session.customer_details?.email || '',
                items: JSON.parse(session.metadata?.items || '[]'),
                kit_quantity: parseInt(session.metadata?.kitQuantity || '1'),
                packaging_type: session.metadata?.packaging || 'kraft',
                total_amount: session.amount_total || 0,
                created_at: new Date(session.created * 1000).toISOString(),
                assigned_agent: null,
              },
              message: 'Order being processed',
            });
          }
        } catch (stripeError) {
          console.error('Stripe session lookup error:', stripeError);
        }

        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      order = data;
    } else if (email && orderNumber) {
      // Look up by email and order number
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          assigned_agent:profiles!assigned_agent_id(
            id,
            full_name,
            avatar_url,
            whatsapp_number,
            email
          )
        `)
        .eq('customer_email', email)
        .eq('order_number', parseInt(orderNumber))
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Order not found. Please check your email and order number.' },
          { status: 404 }
        );
      }

      order = data;
    } else {
      return NextResponse.json(
        { error: 'Please provide session_id or email + order_number' },
        { status: 400 }
      );
    }

    // Format response
    const formattedOrder = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      design_status: order.design_status,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      items: order.items || [],
      kit_quantity: order.kit_quantity,
      packaging_type: order.packaging_type,
      total_amount: order.total_amount,
      created_at: order.created_at,
      paid_at: order.paid_at,
      assigned_agent: order.assigned_agent || null,
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error('Client order lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
