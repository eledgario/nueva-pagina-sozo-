import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const { nombre, empresa, email, whatsapp } = await req.json();

  if (!nombre || !empresa || !email || !whatsapp) {
    return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
  }

  const fecha = new Date().toLocaleString('es-MX', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Mexico_City',
  });

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#fff;border:1px solid #e4e4e7;border-radius:4px;overflow:hidden;">
      <div style="background:#09090b;padding:24px 32px;">
        <p style="color:#FF007F;font-family:monospace;font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 6px;">[SOLICITUD_CATÁLOGO]</p>
        <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;">Nueva solicitud de catálogo</h1>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;font-weight:600;color:#09090b;">${nombre}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Empresa</td><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;font-weight:600;color:#09090b;">${empresa}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Correo</td><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;color:#09090b;"><a href="mailto:${email}" style="color:#FF007F;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">WhatsApp</td><td style="padding:10px 0;color:#09090b;"><a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" style="color:#FF007F;">${whatsapp}</a></td></tr>
        </table>
        <div style="margin-top:28px;">
          <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(nombre)}%2C%20soy%20de%20Sozo.%20Recibimos%20tu%20solicitud%20del%20cat%C3%A1logo%20%F0%9F%98%80"
             style="display:inline-block;background:#FF007F;color:#fff;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:1px;padding:12px 24px;text-decoration:none;border:3px solid #FF007F;">
            Responder por WhatsApp
          </a>
        </div>
        <p style="color:#a1a1aa;font-size:11px;margin-top:24px;font-family:monospace;">${fecha}</p>
      </div>
    </div>
  `;

  if (!resend) {
    // Sin Resend configurado: log y retornar OK igual (no bloquear al usuario)
    console.log('📩 Solicitud catálogo (Resend no configurado):', { nombre, empresa, email, whatsapp });
    return NextResponse.json({ ok: true });
  }

  const { error } = await resend.emails.send({
    from: 'Sozo Web <noreply@sozo.com.mx>',
    to: ['ventas@sozo.com.mx'],
    replyTo: email,
    subject: `📦 Solicitud de catálogo — ${nombre} (${empresa})`,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Error enviando el correo' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
