import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// M&O: public Shopify search API — returns available:boolean
async function checkMOP(modelo: string): Promise<{ available: boolean; url: string }> {
  const res = await fetch(
    `https://www.moplayeras.com/search/suggest.json?q=${encodeURIComponent(modelo)}&resources[type]=product&resources[limit]=1`,
    { cache: 'no-store' }
  );
  if (!res.ok) return { available: false, url: `https://www.moplayeras.com/search?q=${encodeURIComponent(modelo)}` };
  const data = await res.json() as { resources?: { results?: { products?: { available?: boolean; url?: string }[] } } };
  const product = data.resources?.results?.products?.[0];
  return {
    available: product?.available ?? false,
    url: product?.url
      ? `https://www.moplayeras.com${product.url}`
      : `https://www.moplayeras.com/search?q=${encodeURIComponent(modelo)}`,
  };
}

export async function POST(req: NextRequest) {
  const { id, modelo } = await req.json() as { id: string; modelo: string };

  if (id.startsWith('mop_')) {
    const result = await checkMOP(modelo);
    return NextResponse.json(result);
  }

  if (id.startsWith('promo_')) {
    const slug = modelo.toLowerCase().replace(/\s+/g, '-');
    return NextResponse.json({
      available: null,
      url: `https://www.promoopcion.com/${slug}.html`,
    });
  }

  // Innovation (Bubble.io)
  return NextResponse.json({
    available: null,
    url: `https://innovation.com.mx/producto/${modelo.toLowerCase()}`,
  });
}
