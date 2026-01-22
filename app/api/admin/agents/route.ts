import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all agents/producers
export async function GET(request: NextRequest) {
  try {
    // Verify admin password from header
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: agents, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, phone, whatsapp_number, role, is_active, specialties, current_order_count, max_concurrent_orders')
      .in('role', ['agent', 'producer'])
      .eq('is_active', true)
      .order('current_order_count', { ascending: true });

    if (error) {
      console.error('Error fetching agents:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: agents || [] });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
