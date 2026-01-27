import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

// Initialize Resend conditionally
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, orderType, orderId } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name and email' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!resend) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return NextResponse.json({
        success: true,
        message: 'Email skipped (Resend not configured)',
        preview: true,
      });
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Sozo <noreply@sozo.mx>', // Must be a verified domain in Resend
      to: [email],
      subject: `Solicitud recibida - ${orderId || 'Sozo'}`,
      react: OrderConfirmationEmail({
        name,
        company: company || 'Tu Empresa',
        orderType: orderType || 'Proyecto Personalizado',
        orderId: orderId || `SOZO-${Date.now().toString(36).toUpperCase()}`,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (err) {
    console.error('Email API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing/preview
export async function GET() {
  return NextResponse.json({
    service: 'Sozo Email API',
    status: 'operational',
    provider: 'Resend',
    configured: !!process.env.RESEND_API_KEY,
  });
}
