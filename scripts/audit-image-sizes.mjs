/**
 * Audita la resolución de TODAS las imágenes de data/products.json.
 * Lee solo los primeros bytes de cada imagen para obtener sus dimensiones.
 *
 * Uso:
 *   node scripts/audit-image-sizes.mjs               # todas las imágenes
 *   node scripts/audit-image-sizes.mjs --first       # solo la imagen principal de cada producto
 *   node scripts/audit-image-sizes.mjs --min 500     # umbral de "baja resolución" (default: 500)
 *
 * Genera data/image-audit-report.json
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const getArg = (flag, def) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const FIRST   = args.includes('--first');
const MIN     = parseInt(getArg('--min', '500'), 10);
const WORKERS = parseInt(getArg('--workers', '8'), 10);

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
const REPORT_FILE   = path.join(process.cwd(), 'data', 'image-audit-report.json');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseSize(b) {
  if (b.length >= 24 && b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.length >= 30 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') {
    const fmt = b.subarray(12, 16).toString();
    if (fmt === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (fmt === 'VP8L') {
      const n = b.readUInt32LE(21);
      return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
    }
    if (fmt === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  }
  if (b.length >= 10 && b.subarray(0, 3).toString() === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  }
  return null;
}

// Devuelve { w, h } | { error }
async function measure(url) {
  let last = '';
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      // Algunos JPEG traen EXIF/miniaturas grandes antes del encabezado: se amplía el rango si hace falta
      for (const bytes of [16383, 262143]) {
        const res = await fetch(url, {
          headers: { 'User-Agent': UA, Range: `bytes=0-${bytes}` },
          signal: AbortSignal.timeout(30000),
        });
        if (res.status === 404 || res.status === 403) return { error: `HTTP ${res.status}` };
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const b = Buffer.from(await res.arrayBuffer());
        const size = parseSize(b);
        if (size) return { w: size[0], h: size[1] };
        if (b.length <= bytes) return { error: 'formato desconocido' };
      }
      return { error: 'formato desconocido' };
    } catch (e) {
      last = e.message;
      await sleep(1000 * (attempt + 1));
    }
  }
  return { error: last };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const jobs = [];
  for (const p of data.productos) {
    const imgs = (p.imagenes || []).filter((u) => /^https?:\/\//.test(u));
    (FIRST ? imgs.slice(0, 1) : imgs).forEach((url, idx) => jobs.push({ id: p.id, categoria: p.categoria, idx, url }));
  }
  console.log(`Midiendo ${jobs.length} imágenes de ${data.productos.length} productos (umbral ${MIN}px)…`);

  let next = 0, done = 0;
  await Promise.all(Array.from({ length: WORKERS }, async () => {
    while (next < jobs.length) {
      const j = jobs[next++];
      Object.assign(j, await measure(j.url));
      if (++done % 1000 === 0) console.log(`  ${done}/${jobs.length}`);
    }
  }));

  const host = (u) => new URL(u).hostname;
  const summary = {};
  for (const j of jobs) {
    const h = host(j.url);
    const s = (summary[h] ??= { total: 0, baja: 0, error: 0 });
    s.total++;
    if (j.error) s.error++;
    else if (Math.min(j.w, j.h) < MIN) s.baja++;
  }
  console.table(summary);

  const low = jobs.filter((j) => !j.error && Math.min(j.w, j.h) < MIN);
  const errors = jobs.filter((j) => j.error);
  const lowProducts = new Set(low.filter((j) => j.idx === 0).map((j) => j.id));
  console.log(`Imágenes bajo ${MIN}px: ${low.length} (${lowProducts.size} productos con la principal en baja)`);
  console.log(`Imágenes con error: ${errors.length}`);

  fs.writeFileSync(REPORT_FILE, JSON.stringify({ min: MIN, summary, low, errors }, null, 2));
  console.log(`Reporte: ${path.relative(process.cwd(), REPORT_FILE)}`);
}

main();
