import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

interface RawProduct {
  id: string;
  modelo: string;
  nombre: string;
  categoria: string;
}

export async function GET() {
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const pricesPath   = path.join(process.cwd(), 'data', 'prices.json');

  const raw = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const productos: RawProduct[] = raw.productos;

  const prices: Record<string, number | null> = fs.existsSync(pricesPath)
    ? JSON.parse(fs.readFileSync(pricesPath, 'utf8'))
    : {};

  const rows = productos.map(p => ({
    id: p.id,
    modelo: p.modelo,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: prices[p.id] ?? null,
    fuente: p.id.startsWith('promo') ? 'promoopcion' : 'innovation',
  }));

  return NextResponse.json({ productos: rows });
}
