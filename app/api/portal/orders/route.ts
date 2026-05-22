import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        design_status,
        customer_name,
        customer_email,
        items,
        kit_quantity,
        packaging_type,
        total_amount,
        created_at,
        paid_at,
        assigned_agent:profiles!assigned_agent_id(
          id, full_name, avatar_url, whatsapp_number, email
        )
      `)
      .eq('customer_email', user.email!)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Portal orders error:', error);
      return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: orders ?? [] });
  } catch (err) {
    console.error('Portal orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
