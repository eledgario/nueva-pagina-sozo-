import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Fallback local (solo funciona en dev, no en Vercel)
const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

interface Lead {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

function readLocalLeads(): Lead[] {
  try {
    fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
    if (!fs.existsSync(LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveLocalLead(lead: Lead) {
  const leads = readLocalLeads();
  leads.push(lead);
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function POST(req: NextRequest) {
  const { nombre, empresa, email, whatsapp } = await req.json();

  if (!nombre || !empresa || !email || !whatsapp) {
    return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    nombre,
    empresa,
    email,
    whatsapp,
  };

  if (supabase) {
    const { error } = await supabase.from('expo_leads').insert({
      nombre,
      empresa,
      email,
      whatsapp,
    });
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // Fallback solo en desarrollo
    saveLocalLead(lead);
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-password');
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let leads: Lead[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('expo_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    leads = data || [];
  } else {
    leads = readLocalLeads();
  }

  const format = new URL(req.url).searchParams.get('format');
  if (format === 'csv') {
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
}
