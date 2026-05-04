import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

function readLeads(): Lead[] {
  try {
    fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
    if (!fs.existsSync(LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveLeads(leads: Lead[]) {
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

interface Lead {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, empresa, email, whatsapp } = body;

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

  const leads = readLeads();
  leads.push(lead);
  saveLeads(leads);

  console.log(`✅ Lead guardado: ${nombre} — ${empresa}`);
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-password');
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const leads = readLeads();

  // Si piden CSV, devolver CSV
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
