/**
 * Verifica que los productos promo_* de data/products.json existan en PromoOpcion.
 *
 * Uso:
 *   npx tsx scripts/check-promoopcion.ts               # revisa todo y genera reporte
 *   npx tsx scripts/check-promoopcion.ts --limit 20    # prueba con N productos
 *   npx tsx scripts/check-promoopcion.ts --workers 8   # paralelismo (default: 8)
 *   npx tsx scripts/check-promoopcion.ts --retry-errors  # re-verifica solo los 'error' del último reporte
 *   npx tsx scripts/check-promoopcion.ts --apply       # aplica el último reporte:
 *       elimina los "missing" y guarda promoSlug en los "slug_fix" (con respaldo)
 */

import * as fs from 'fs';
import * as path from 'path';
import { PROMO_BASE, promoSlug } from '../lib/promoopcion';

// ─── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag: string, def: string) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const workers  = parseInt(getArg('--workers', '8'), 10);
const limitArg = parseInt(getArg('--limit', '0'), 10);
const applyArg = args.includes('--apply');
const retryArg = args.includes('--retry-errors');

// ─── Config ────────────────────────────────────────────────────────────────────
const DATA_DIR      = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const PRICES_FILE   = path.join(DATA_DIR, 'prices.json');
const REPORT_JSON   = path.join(DATA_DIR, 'promo-check-report.json');
const REPORT_CSV    = path.join(DATA_DIR, 'promo-check-report.csv');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  modelo: string;
  nombre: string;
  categoria: string;
  promoSlug?: string;
}

type Estado = 'ok' | 'slug_fix' | 'missing' | 'error';

interface ReportRow {
  id: string;
  modelo: string;
  nombre: string;
  estado: Estado;
  url_probada: string;
  url_correcta: string | null;
  slug_correcto: string | null;
  detalle?: string;
}

// ─── Utilidades ────────────────────────────────────────────────────────────────
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// Slug que usaba el sitio antes de normalizar (puede traer puntos, acentos, etc.)
function legacySlug(modelo: string) {
  return modelo.toLowerCase().replace(/\s+/g, '-');
}

class NetError extends Error {}

// Devuelve el status HTTP, reintentando en 5xx / timeouts. Lanza NetError si no hay respuesta confiable.
async function fetchStatus(url: string, method: 'HEAD' | 'GET' = 'HEAD'): Promise<{ status: number; body?: string }> {
  let lastErr = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: { 'User-Agent': UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(30000),
      });
      if (res.status === 200 || res.status === 404) {
        return { status: res.status, body: method === 'GET' ? await res.text() : undefined };
      }
      lastErr = `HTTP ${res.status}`;
    } catch (e) {
      lastErr = (e as Error).message;
    }
    await sleep(1500 * (attempt + 1));
  }
  throw new NetError(lastErr);
}

// Búsqueda en PromoOpcion: acepta un resultado cuyo slug coincida con el modelo ignorando guiones.
async function searchSlug(modelo: string): Promise<string | null> {
  const { status, body } = await fetchStatus(
    `${PROMO_BASE}/catalogsearch/result/?q=${encodeURIComponent(modelo)}`, 'GET'
  );
  if (status !== 200 || !body) return null;
  const target = promoSlug(modelo).replace(/-/g, '');
  const slugs = new Set(
    Array.from(body.matchAll(/href="https:\/\/www\.promoopcion\.com\/([a-z0-9-]+)\.html"/g), m => m[1])
  );
  for (const s of slugs) {
    if (s.replace(/-/g, '') === target) return s;
  }
  return null;
}

async function checkProduct(p: Product): Promise<ReportRow> {
  const base = { id: p.id, modelo: p.modelo, nombre: p.nombre };
  const legacy = p.promoSlug ?? legacySlug(p.modelo);
  const legacyUrl = `${PROMO_BASE}/${legacy}.html`;
  try {
    if ((await fetchStatus(legacyUrl)).status === 200) {
      return { ...base, estado: 'ok', url_probada: legacyUrl, url_correcta: legacyUrl, slug_correcto: null };
    }

    const normalized = promoSlug(p.modelo);
    if (normalized !== legacy) {
      const url = `${PROMO_BASE}/${normalized}.html`;
      if ((await fetchStatus(url)).status === 200) {
        // La función promoSlug ya produce este slug, no hace falta guardarlo en el producto
        return { ...base, estado: 'slug_fix', url_probada: legacyUrl, url_correcta: url, slug_correcto: null, detalle: 'normalizado' };
      }
    }

    const found = await searchSlug(p.modelo);
    if (found) {
      const url = `${PROMO_BASE}/${found}.html`;
      if ((await fetchStatus(url)).status === 200) {
        return { ...base, estado: 'slug_fix', url_probada: legacyUrl, url_correcta: url, slug_correcto: found, detalle: 'búsqueda' };
      }
    }

    return { ...base, estado: 'missing', url_probada: legacyUrl, url_correcta: null, slug_correcto: null };
  } catch (e) {
    return { ...base, estado: 'error', url_probada: legacyUrl, url_correcta: null, slug_correcto: null, detalle: (e as Error).message };
  }
}

function csvCell(v: unknown) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeReport(rows: ReportRow[]) {
  fs.writeFileSync(REPORT_JSON, JSON.stringify(rows, null, 2));
  const cols: (keyof ReportRow)[] = ['id', 'modelo', 'nombre', 'estado', 'url_probada', 'url_correcta', 'slug_correcto', 'detalle'];
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => csvCell(r[c])).join(','))].join('\n');
  fs.writeFileSync(REPORT_CSV, csv);
}

// ─── Check ─────────────────────────────────────────────────────────────────────
async function runCheck() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8')) as { productos: Product[] };
  let products = data.productos.filter(p => p.id.startsWith('promo_'));
  let previous: ReportRow[] = [];
  if (retryArg) {
    previous = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8')) as ReportRow[];
    const errIds = new Set(previous.filter(r => r.estado === 'error').map(r => r.id));
    products = products.filter(p => errIds.has(p.id));
  }
  if (limitArg > 0) products = products.slice(0, limitArg);

  console.log(`🔎 Verificando ${products.length} productos PromoOpcion con ${workers} workers…`);
  const results: ReportRow[] = new Array(products.length);
  let next = 0, done = 0;
  const counts: Record<Estado, number> = { ok: 0, slug_fix: 0, missing: 0, error: 0 };

  await Promise.all(Array.from({ length: workers }, async () => {
    while (next < products.length) {
      const i = next++;
      const row = await checkProduct(products[i]);
      results[i] = row;
      counts[row.estado]++;
      done++;
      if (row.estado !== 'ok') console.log(`  [${row.estado}] ${row.id} (${row.modelo})`);
      if (done % 100 === 0) console.log(`  … ${done}/${products.length}  ${JSON.stringify(counts)}`);
      await sleep(100);
    }
  }));

  if (retryArg) {
    const byId = new Map(results.map(r => [r.id, r]));
    const merged = previous.map(r => byId.get(r.id) ?? r);
    writeReport(merged);
    for (const k of Object.keys(counts) as Estado[]) counts[k] = merged.filter(r => r.estado === k).length;
  } else {
    writeReport(results);
  }
  console.log('\n📊 Resumen:', counts);
  console.log(`📝 Reporte: ${path.relative(process.cwd(), REPORT_JSON)} / ${path.relative(process.cwd(), REPORT_CSV)}`);
  if (counts.error) console.log('⚠️  Hay errores de red: corre con --retry-errors antes de aplicar.');
  console.log('Revisa el reporte y luego corre con --apply para eliminar los "missing".');
}

// ─── Apply ─────────────────────────────────────────────────────────────────────
function runApply() {
  if (!fs.existsSync(REPORT_JSON)) {
    console.error('No existe data/promo-check-report.json — corre el check primero.');
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8')) as ReportRow[];
  const missing = new Set(report.filter(r => r.estado === 'missing').map(r => r.id));
  const fixes = new Map(report.filter(r => r.estado === 'slug_fix' && r.slug_correcto).map(r => [r.id, r.slug_correcto!]));

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  fs.copyFileSync(PRODUCTS_FILE, path.join(DATA_DIR, `products.backup-${stamp}.json`));
  fs.copyFileSync(PRICES_FILE, path.join(DATA_DIR, `prices.backup-${stamp}.json`));

  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8')) as {
    productos: Product[];
    categorias: { id: string; count?: number }[];
  };
  const before = data.productos.length;
  data.productos = data.productos.filter(p => !missing.has(p.id));
  for (const p of data.productos) {
    const slug = fixes.get(p.id);
    if (slug) p.promoSlug = slug;
  }
  for (const c of data.categorias) {
    if (c.count == null) continue;
    c.count = data.productos.filter(p => p.categoria === c.id).length;
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));

  const prices = JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8')) as Record<string, number | null>;
  for (const id of missing) delete prices[id];
  fs.writeFileSync(PRICES_FILE, JSON.stringify(prices, null, 2));

  console.log(`🗑️  Eliminados ${before - data.productos.length} productos (respaldo: products.backup-${stamp}.json)`);
  console.log(`🔧 promoSlug guardado en ${fixes.size} productos`);
}

if (applyArg) runApply();
else runCheck().catch(e => { console.error(e); process.exit(1); });
