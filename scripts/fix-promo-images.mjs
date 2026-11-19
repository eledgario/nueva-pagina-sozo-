/**
 * Reemplaza las imágenes de baja resolución (miniaturas de 88px guardadas en Supabase)
 * de los productos promo_* por las originales de la galería de PromoOpcion.
 *
 * Uso:
 *   node scripts/fix-promo-images.mjs --limit 20     # prueba con N productos (no escribe)
 *   node scripts/fix-promo-images.mjs --apply        # procesa todo y guarda (con respaldo)
 *   node scripts/fix-promo-images.mjs --min 400      # ancho mínimo aceptable (default: 400)
 *   node scripts/fix-promo-images.mjs --from-audit --apply
 *   node scripts/fix-promo-images.mjs --from-audit --ids promo_a,promo_b --apply   # solo esos productos
 *       usa data/image-audit-report.json (scripts/audit-image-sizes.mjs) y reemplaza la galería
 *       de todo producto con CUALQUIER imagen de Supabase en baja resolución, no solo la principal
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const getArg = (flag, def) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const APPLY   = args.includes('--apply');
const LIMIT   = parseInt(getArg('--limit', '0'), 10);
const MIN_W   = parseInt(getArg('--min', '400'), 10);
const WORKERS = parseInt(getArg('--workers', '6'), 10);
const FROM_AUDIT = args.includes('--from-audit');
const IDS = getArg('--ids', '') ? new Set(getArg('--ids', '').split(',')) : null;

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
const REPORT_FILE   = path.join(process.cwd(), 'data', 'fix-promo-images-report.json');
const AUDIT_FILE    = path.join(process.cwd(), 'data', 'image-audit-report.json');
const PROMO_BASE = 'https://www.promoopcion.com';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Igual que lib/promoopcion.ts
function promoSlug(modelo) {
  return modelo
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchRetry(url, opts = {}, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...opts, headers: { 'User-Agent': UA, ...(opts.headers || {}) } });
      if (res.status === 404) return res;
      if (res.ok || res.status === 206) return res;
    } catch {}
    await sleep(800 * (i + 1));
  }
  return null;
}

// Ancho de un JPEG/PNG/WebP leyendo solo los primeros bytes
async function imageWidth(url) {
  const res = await fetchRetry(url, { headers: { Range: 'bytes=0-8191' } });
  if (!res || res.status === 404) return null;
  const b = Buffer.from(await res.arrayBuffer());
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return b.readUInt32BE(16);
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') {
    const fmt = b.subarray(12, 16).toString();
    if (fmt === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
    if (fmt === 'VP8L') return 1 + (((b[22] & 0x3f) << 8) | b[21]);
    if (fmt === 'VP8X') return 1 + b.readUIntLE(24, 3);
  }
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xc3) return b.readUInt16BE(i + 7);
    i += 2 + len;
  }
  return null;
}

// Imágenes originales de la galería del producto en PromoOpcion
async function promoGallery(slug) {
  const res = await fetchRetry(`${PROMO_BASE}/${slug}.html`);
  if (!res || !res.ok) return null;
  const html = (await res.text()).replace(/\\\//g, '/');
  const re = /class="mt-thumb-switcher[^"]*"[^>]*?href="(https:\/\/www\.promoopcion\.com\/media\/catalog\/product\/[^"?]+)/g;
  const urls = [];
  for (const m of html.matchAll(re)) if (!urls.includes(m[1])) urls.push(m[1]);
  return urls;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  let targets = data.productos.filter(
    (p) => p.id?.startsWith('promo_') && p.imagenes?.[0]?.includes('supabase.co'),
  );
  let lowIds = null;
  if (FROM_AUDIT) {
    const audit = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
    lowIds = new Set(audit.low.filter((j) => j.url.includes('supabase.co')).map((j) => j.id));
    targets = data.productos.filter((p) => p.id?.startsWith('promo_') && lowIds.has(p.id));
  }
  if (IDS) targets = targets.filter((p) => IDS.has(p.id));
  if (LIMIT) targets = targets.slice(0, LIMIT);
  console.log(`Revisando ${targets.length} productos (ancho mínimo ${MIN_W}px)…`);

  const report = [];
  let done = 0;
  const queue = [...targets];
  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      const w = lowIds ? 0 : await imageWidth(p.imagenes[0]);
      const row = { id: p.id, modelo: p.modelo, ancho: w, estado: 'ok' };
      if (w === null || w < MIN_W) {
        // Algunos modelos conservan guiones finales en la URL ("USB 05-" → usb-05-)
        const slugs = [...new Set([p.promoSlug, promoSlug(p.modelo), p.modelo.toLowerCase().replace(/\s+/g, '-')].filter(Boolean))];
        let gallery = null;
        for (const slug of slugs) {
          gallery = await promoGallery(slug);
          if (gallery?.length) break;
        }
        if (!gallery) row.estado = 'sin_pagina';
        else if (!gallery.length) row.estado = 'sin_galeria';
        else {
          row.estado = 'reemplazado';
          row.antes = p.imagenes.length;
          row.despues = gallery.length;
          p.imagenes = gallery;
        }
      }
      report.push(row);
      if (++done % 100 === 0) console.log(`  ${done}/${targets.length}`);
    }
  }
  await Promise.all(Array.from({ length: WORKERS }, worker));

  const count = (e) => report.filter((r) => r.estado === e).length;
  console.log({
    ok: count('ok'),
    reemplazado: count('reemplazado'),
    sin_pagina: count('sin_pagina'),
    sin_galeria: count('sin_galeria'),
  });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  if (APPLY) {
    const backup = PRODUCTS_FILE.replace('.json', `.backup-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-imgs.json`);
    fs.copyFileSync(PRODUCTS_FILE, backup);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2) + '\n');
    console.log(`Guardado. Respaldo: ${path.basename(backup)}`);
  } else {
    console.log('Modo prueba: no se escribió products.json (usa --apply).');
    console.log(report.filter((r) => r.estado !== 'ok').slice(0, 5));
  }
}

main();
