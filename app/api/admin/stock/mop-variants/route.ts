import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ShopifyVariant {
  title: string;
  price: string;
}

interface ShopifySuggestProduct {
  title?: string;
  url?: string;
  available?: boolean;
}

export async function GET(req: NextRequest) {
  const modelo = req.nextUrl.searchParams.get('modelo');
  if (!modelo) return NextResponse.json({ error: 'modelo required' }, { status: 400 });

  // Search up to 10 colors for this model number
  const searchRes = await fetch(
    `https://www.moplayeras.com/search/suggest.json?q=${encodeURIComponent(modelo)}&resources[type]=product&resources[limit]=10`,
    { cache: 'no-store' }
  );
  if (!searchRes.ok) return NextResponse.json({ colors: [], sizes: [] });

  const searchData = await searchRes.json() as {
    resources?: { results?: { products?: ShopifySuggestProduct[] } }
  };
  const products = searchData.resources?.results?.products ?? [];

  const colors = products.map(p => {
    // Extract color name: everything after the model number in the title
    const titleParts = (p.title ?? '').split(modelo);
    const name = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : (p.title ?? '');
    const handle = p.url?.split('/products/')?.[1] ?? '';
    return {
      name: name || handle,
      available: p.available ?? false,
      url: p.url ? `https://www.moplayeras.com${p.url}` : '',
      handle,
    };
  });

  // Get sizes from the first result's product.json
  let sizes: { title: string; price: string }[] = [];
  const firstHandle = colors[0]?.handle;
  if (firstHandle) {
    try {
      const productRes = await fetch(
        `https://www.moplayeras.com/products/${firstHandle}.json`,
        { cache: 'no-store' }
      );
      if (productRes.ok) {
        const productData = await productRes.json() as { product?: { variants?: ShopifyVariant[] } };
        sizes = (productData.product?.variants ?? []).map(v => ({
          title: v.title,
          price: v.price,
        }));
      }
    } catch {}
  }

  return NextResponse.json({ colors, sizes });
}
