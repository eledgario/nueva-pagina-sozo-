import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/portal/messages?order_id=xxx
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orderId = new URL(request.url).searchParams.get('order_id');
  if (!orderId) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

  // Verify client owns this order
  const { data: order } = await supabase
    .from('orders')
    .select('id, customer_email')
    .eq('id', orderId)
    .eq('customer_email', user.email!)
    .single();

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const { data: messages, error } = await supabase
    .from('order_messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages });
}

// POST /api/portal/messages
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { order_id, body } = await request.json();
  if (!order_id || !body?.trim()) {
    return NextResponse.json({ error: 'order_id and body required' }, { status: 400 });
  }

  // Verify client owns this order
  const { data: order } = await supabase
    .from('orders')
    .select('id, customer_name, customer_email')
    .eq('id', order_id)
    .eq('customer_email', user.email!)
    .single();

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const { data: message, error } = await supabase
    .from('order_messages')
    .insert({
      order_id,
      sender_id: user.id,
      sender_name: order.customer_name || user.email!,
      sender_role: 'client',
      body: body.trim(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message });
}
