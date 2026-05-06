import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

interface Lead {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, empresa, email, whatsapp } = await req.json();

    if (!nombre || !empresa || !email || !whatsapp) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 });
    }

    const { error } = await supabase.from('expo_leads').insert({ nombre, empresa, email, whatsapp });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/leads error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('x-admin-password');
    if (auth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('expo_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leads: Lead[] = data || [];

    // CSV export
    const { searchParams } = new URL(req.url);
    if (searchParams.get('format') === 'csv') {
      const rows = [
        'Fecha,Nombre,Empresa,Email,WhatsApp',
        ...leads.map((l) =>
          [
            new Date(l.created_at).toLocaleString('es-MX'),
            `"${l.nombre}"`,
            `"${l.empresa}"`,
            l.email,
            l.whatsapp,
          ].join(',')
        ),
      ].join('\n');

      return new NextResponse(rows, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="leads-expo.csv"',
        },
      });
    }

    return NextResponse.json({ leads });
  } catch (err) {
    console.error('GET /api/leads error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
