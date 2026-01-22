import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  calculatePricing,
  PRODUCT_BASE_PRICES,
  PACKAGING_PRICES,
  formatPrice,
  getTierForQuantity,
} from '@/lib/pricing';

// Initialize Stripe only if key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export interface CheckoutItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  packaging: 'mailer' | 'kraft' | 'premium';
  kitQuantity: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  companyName?: string;
}

const PACKAGING_NAMES: Record<string, string> = {
  mailer: 'Mailer Bag',
  kraft: 'Caja Kraft',
  premium: 'Caja Full Print Premium',
};

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no esta configurado. Contacta al administrador.' },
        { status: 503 }
      );
    }

    const body: CheckoutRequest = await request.json();
    const { items, packaging, kitQuantity, customerEmail, customerName, customerPhone, companyName } = body;

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!kitQuantity || kitQuantity < 1) {
      return NextResponse.json(
        { error: 'Invalid kit quantity' },
        { status: 400 }
      );
    }

    // Convert items to pricing format
    const pricingItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      basePrice: PRODUCT_BASE_PRICES[item.id] || 10000, // Default $100 if not found
      quantity: item.quantity,
    }));

    const packagingPrice = PACKAGING_PRICES[packaging] || PACKAGING_PRICES.kraft;

    // Calculate pricing
    const pricing = calculatePricing(pricingItems, kitQuantity, packagingPrice);
    const tier = getTierForQuantity(kitQuantity);
    const discountMultiplier = 1 - tier.discount;

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const basePrice = PRODUCT_BASE_PRICES[item.id] || 10000;
      const discountedPrice = Math.round(basePrice * item.quantity * discountMultiplier);

      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name,
            description: `${item.quantity} unidad(es) por kit`,
            images: item.imageUrl ? [item.imageUrl] : undefined,
          },
          unit_amount: discountedPrice,
        },
        quantity: kitQuantity,
      };
    });

    // Add packaging line item
    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: `Empaque: ${PACKAGING_NAMES[packaging]}`,
          description: 'Packaging personalizado con tu marca',
        },
        unit_amount: Math.round(packagingPrice * discountMultiplier),
      },
      quantity: kitQuantity,
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      // Enable OXXO and bank transfer for Mexico
      payment_method_options: {
        oxxo: {
          expires_after_days: 3,
        },
      },
      line_items: lineItems,
      // Apply Mexican tax
      automatic_tax: {
        enabled: false, // We calculate manually
      },
      // Add tax as separate line item
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Orden de Kits Corporativos - ${kitQuantity} kits`,
          footer: 'Gracias por tu compra. La produccion inicia tras aprobacion del diseno.',
        },
      },
      // Customer info
      customer_email: customerEmail,
      // Collect billing address
      billing_address_collection: 'required',
      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ['MX'],
      },
      // Custom fields
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Nombre de empresa',
          },
          type: 'text',
          optional: true,
        },
        {
          key: 'phone',
          label: {
            type: 'custom',
            custom: 'Telefono de contacto',
          },
          type: 'text',
        },
      ],
      // Metadata for webhook processing
      metadata: {
        items: JSON.stringify(items),
        packaging,
        kitQuantity: kitQuantity.toString(),
        subtotal: pricing.subtotal.toString(),
        discount: pricing.discount.toString(),
        discountPercent: pricing.discountPercent.toString(),
        tax: pricing.tax.toString(),
        total: pricing.total.toString(),
        customerName: customerName || '',
        companyName: companyName || '',
      },
      // Success and cancel URLs
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?checkout=cancelled`,
      // Expiration
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    });

    // Return session info
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      pricing: {
        subtotal: formatPrice(pricing.subtotal),
        discount: formatPrice(pricing.discount),
        discountPercent: Math.round(pricing.discountPercent * 100),
        discountLabel: pricing.discountLabel,
        tax: formatPrice(pricing.tax),
        total: formatPrice(pricing.total),
        pricePerKit: formatPrice(pricing.pricePerKit),
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve session status
export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no esta configurado' },
        { status: 503 }
      );
    }

    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent', 'line_items'],
    });

    return NextResponse.json({
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Error retrieving session' },
      { status: 500 }
    );
  }
}
