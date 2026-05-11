import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 60_000; // 1 minute

async function getProductsData() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;
  const raw = await readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf-8');
  cache = { data: JSON.parse(raw), ts: Date.now() };
  return cache.data;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') ?? 'todos';
  const search   = (searchParams.get('search') ?? '').trim().toLowerCase();
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = parseInt(searchParams.get('pageSize') ?? '18', 10);
  const meta     = searchParams.get('meta') === '1';

  const data = await getProductsData() as {
    tecnicas: unknown[]; categorias: unknown[];
    productos: Array<{ id: string; nombre: string; modelo: string; desc: string; categoria: string; tecnicas: string[]; imagenes?: string[]; dimensiones?: string; colores?: string; }>;
  };

  if (meta) {
    return NextResponse.json({
      tecnicas:   data.tecnicas,
      categorias: data.categorias,
      total:      data.productos.length,
    });
  }

  let list = category === 'todos'
    ? data.productos
    : data.productos.filter(p => p.categoria === category);

  if (search) {
    list = list.filter(p =>
      p.nombre.toLowerCase().includes(search) ||
      p.modelo.toLowerCase().includes(search) ||
      p.desc.toLowerCase().includes(search)
    );
  }

  const total = list.length;
  const products = list.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ products, total, page, pageSize });
}
