import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

export interface PrintingTier {
  min: number;
  max: number | null; // null = sin límite
  precio: number;
}

export interface PrintingOption {
  id: string;
  tecnica: string;
  descripcion: string;
  tiers: PrintingTier[];
}

const FILE = path.join(process.cwd(), 'data', 'printing-prices.json');

function load(): PrintingOption[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function save(data: PrintingOption[]) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(load());
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<PrintingOption, 'id'>;
  const options = load();
  const newOption: PrintingOption = {
    ...body,
    id: `${Date.now()}`,
  };
  options.push(newOption);
  save(options);
  return NextResponse.json(newOption, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as PrintingOption;
  const options = load();
  const idx = options.findIndex(o => o.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  options[idx] = body;
  save(options);
  return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const options = load().filter(o => o.id !== id);
  save(options);
  return NextResponse.json({ ok: true });
}
