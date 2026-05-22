import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/portal/artworks?order_id=xxx
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orderId = new URL(request.url).searchParams.get('order_id');
  if (!orderId) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('customer_email', user.email!)
    .single();

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const { data: artworks, error } = await supabase
    .from('order_artworks')
    .select('*')
    .eq('order_id', orderId)
    .order('version', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ artworks });
}

// PATCH /api/portal/artworks — approve or reject
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { artwork_id, status, comment } = await request.json();
  if (!artwork_id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'artwork_id and valid status required' }, { status: 400 });
  }
  if (status === 'rejected' && !comment?.trim()) {
    return NextResponse.json({ error: 'Comment required when rejecting' }, { status: 400 });
  }

  // Verify client owns this artwork's order
  const { data: artwork } = await supabase
    .from('order_artworks')
    .select('id, order_id, orders!inner(customer_email)')
    .eq('id', artwork_id)
    .eq('status', 'pending')
    .single() as { data: { id: string; order_id: string; orders: { customer_email: string } } | null };

  if (!artwork || (artwork.orders as { customer_email: string }).customer_email !== user.email) {
    return NextResponse.json({ error: 'Artwork not found or already reviewed' }, { status: 404 });
  }

  const { data: updated, error } = await supabase
    .from('order_artworks')
    .update({
      status,
      client_comment: comment?.trim() || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', artwork_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If approved, update order design_status
  if (status === 'approved') {
    await supabase
      .from('orders')
      .update({ design_status: 'approved', status: 'in_production' })
      .eq('id', artwork.order_id);
  } else {
    await supabase
      .from('orders')
      .update({ design_status: 'revision_requested' })
      .eq('id', artwork.order_id);
  }

  return NextResponse.json({ artwork: updated });
}
