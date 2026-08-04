/**
 * Scraper de precios — Innovation Line (Bubble.io) + PromoOpcion (Magento)
 *
 * Uso:
 *   npx tsx scripts/scrape-prices.ts               # solo kits
 *   npx tsx scripts/scrape-prices.ts --cat all      # todos los productos
 *   npx tsx scripts/scrape-prices.ts --source innov # solo Innovation
 *   npx tsx scripts/scrape-prices.ts --source promo # solo PromoOpcion
 *   npx tsx scripts/scrape-prices.ts --workers 4    # paralelismo (default: 3)
 *   npx tsx scripts/scrape-prices.ts --force        # re-scrapea productos con precio null
 *   npx tsx scripts/scrape-prices.ts --limit 5      # prueba con N productos
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ─── Cargar .env.local manualmente ────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [k, ...vParts] = line.split('=');
    if (k && vParts.length) process.env[k.trim()] = vParts.join('=').trim();
  }
}

// ─── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag: string, def: string) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const catArg    = getArg('--cat', 'kits');
const sourceArg = getArg('--source', 'both');
const workers   = parseInt(getArg('--workers', '3'), 10);
const limitArg  = parseInt(getArg('--limit', '0'), 10);
const forceArg  = args.includes('--force');

// ─── Config ────────────────────────────────────────────────────────────────────
const INNOV_EMAIL    = process.env.INNOV_EMAIL    ?? '';
const INNOV_PASSWORD = process.env.INNOV_PASSWORD ?? '';
const PROMO_EMAIL    = process.env.PROMO_EMAIL    ?? '';
const PROMO_PASSWORD = process.env.PROMO_PASSWORD ?? '';
const INNOV_BASE     = 'https://innovation.com.mx';
const PROMO_BASE     = 'https://www.promoopcion.com';
const PRICES_FILE    = path.join(process.cwd(), 'data', 'prices.json');
const PRODUCTS_FILE  = path.join(process.cwd(), 'data', 'products.json');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  modelo: string;
  nombre: string;
  categoria: string;
}

// ─── Utilidades ────────────────────────────────────────────────────────────────
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function loadPrices(): Record<string, number | null> {
  return fs.existsSync(PRICES_FILE)
    ? JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'))
    : {};
}

function savePrices(prices: Record<string, number | null>) {
  fs.writeFileSync(PRICES_FILE, JSON.stringify(prices, null, 2));
}

function promoUrl(modelo: string) {
  return PROMO_BASE + '/' + modelo.toLowerCase().replace(/\s+/g, '-') + '.html';
}

function innovUrl(modelo: string) {
  return INNOV_BASE + '/producto/' + modelo.toLowerCase();
}

// ─── Extracción de precio ──────────────────────────────────────────────────────
// PromoOpcion: el precio se inyecta vía AJAX (storeconnection/ajax/simpleproductattr).
// Extraemos el parentId del HTML y llamamos el endpoint dentro del contexto del browser
// para heredar las cookies de sesión y obtener el precio del grupo del cliente.
async function extractPricePromo(page: Page): Promise<number | null> {
  try {
    const result = await page.evaluate(async (): Promise<number | null> => {
      // parentId está definido como variable JS inline en el HTML de la página
      const match = document.documentElement.innerHTML.match(/let parentId = (\d+);/);
      if (!match) return null;
      const parentId = match[1];

      const url = `https://www.promoopcion.com/storeconnection/ajax/simpleproductattr?id=${parentId}&optionIdLabel=&size=&getAll=1`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();

      // data.base = precio del grupo del cliente logueado (preferido)
      if (data.base) {
        const n = parseFloat(String(data.base).replace(/[^0-9.]/g, ''));
        if (n >= 10 && n <= 50000) return n;
      }

      // data.all = JSON string con precio de catálogo como fallback
      if (data.all) {
        const all = JSON.parse(data.all);
        const n = parseFloat(String(all.price ?? '').replace(/[^0-9.]/g, ''));
        if (n >= 10 && n <= 50000) return n;
      }

      return null;
    });
    return result;
  } catch {
    return null;
  }
}

// Innovation: usa DOM text nodes para evitar el código JS de Bubble.io en textContent
async function extractPriceInnov(page: Page): Promise<number | null> {
  try {
    const prices = await page.evaluate((): string[] => {
      return Array.from(document.querySelectorAll('*:not(script):not(style)'))
        .filter(el => el.children.length === 0)
        .map(el => el.textContent?.trim() ?? '')
        .filter(t => /^\$\s*[\d,]+(?:\.\d{1,2})?$/.test(t));
    });
    for (const t of prices) {
      const n = parseFloat(t.replace(/[^0-9.]/g, ''));
      if (n >= 10 && n <= 50000) return n;
    }
  } catch {}
  return null;
}

// ─── Login Innovation (Bubble.io) ─────────────────────────────────────────────
async function loginInnovation(context: BrowserContext): Promise<Page> {
  console.log('🔐 Login Innovation (Bubble.io)…');
  const page = await context.newPage();
  try {
    await page.goto(INNOV_BASE + '/', { waitUntil: 'networkidle', timeout: 40000 });
    await sleep(2000);

    // Abrir modal de login
    await page.locator('button:has-text("Iniciar sesión")').first().click();
    await sleep(2500);

    // Bubble.io: dos inputs — cuenta y contraseña
    const inputs = await page.locator('input:visible').all();
    if (inputs.length >= 2) {
      await inputs[0].fill(INNOV_EMAIL);
      await inputs[1].fill(INNOV_PASSWORD);
      // Usar Enter para evitar el greyout que bloquea el click del botón
      await inputs[1].press('Enter');
      await sleep(3500);

      // Confirmar que el modal se cerró (sin inputs visibles)
      const remaining = await page.locator('input:visible').count();
      if (remaining === 0) {
        console.log('✅ Login Innovation OK');
      } else {
        console.warn('⚠️  Modal de login sigue abierto — continuando igual');
      }
    } else {
      console.warn('⚠️  No se encontraron inputs en el modal de Innovation');
    }
  } catch (e) {
    console.warn('⚠️  Login Innovation falló:', String(e).slice(0, 80));
  }
  return page;
}

// ─── Login PromoOpcion (Magento) ───────────────────────────────────────────────
async function loginPromoOpcion(context: BrowserContext): Promise<Page> {
  console.log('🔐 Login PromoOpcion (Magento)…');
  const page = await context.newPage();
  try {
    // networkidle asegura que la form_key (CSRF) de Magento esté lista
    await page.goto(PROMO_BASE + '/customer/account/login/', {
      waitUntil: 'networkidle', timeout: 25000,
    });
    await sleep(800);
    await page.locator('#email').fill(PROMO_EMAIL);
    await page.locator('#pass').first().fill(PROMO_PASSWORD);
    // Enter es más confiable que click en #send2 para evitar el "Invalid Form Key"
    await page.locator('#pass').first().press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    await sleep(800);
    const ok = !page.url().includes('login');
    console.log(ok ? '✅ Login PromoOpcion OK' : '⚠️  Login PromoOpcion puede haber fallado');
  } catch (e) {
    console.warn('⚠️  Login PromoOpcion falló:', String(e).slice(0, 80));
  }
  return page;
}

// ─── Worker: scrape un lote de productos ──────────────────────────────────────
async function scrapeWorker(
  page: Page,
  products: Product[],
  urlFn: (m: string) => string,
  extractFn: (p: Page) => Promise<number | null>,
  waitAfterNav: number,
  prices: Record<string, number | null>,
  label: string,
  progress: { done: number; total: number },
): Promise<void> {
  for (const p of products) {
    progress.done++;
    const pct = Math.round((progress.done / progress.total) * 100);
    process.stdout.write(`\r[${pct}%] ${progress.done}/${progress.total} ${label} — ${p.modelo.padEnd(14)} `);

    try {
      await page.goto(urlFn(p.modelo), { waitUntil: 'domcontentloaded', timeout: 22000 });
      if (waitAfterNav > 0) await sleep(waitAfterNav);
      const price = await extractFn(page);
      prices[p.id] = price;
      if (price != null) process.stdout.write(`$${price}   `);
    } catch {
      prices[p.id] = null;
    }

    if (progress.done % 50 === 0) savePrices({ ...loadPrices(), ...prices });
    await sleep(200);
  }
}

// Divide array en N chunks
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => out[i % n].push(item));
  return out;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const raw = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  let products: Product[] = raw.productos;

  if (catArg !== 'all') {
    products = products.filter(p => p.categoria === catArg);
  }

  const existing = loadPrices();
  const pending = forceArg
    ? products.filter(p => existing[p.id] == null)
    : products.filter(p => !(p.id in existing));

  // Apply source filter and limit AFTER splitting, so --limit respects --source
  let innovPending = sourceArg === 'promo' ? [] : pending.filter(p => !p.id.startsWith('promo') && !p.id.startsWith('mop'));
  let promoPending = sourceArg === 'innov' ? [] : pending.filter(p =>  p.id.startsWith('promo'));
  if (limitArg > 0) {
    innovPending = innovPending.slice(0, limitArg);
    promoPending = promoPending.slice(0, limitArg);
  }

  console.log(`\n📦 Categoría: ${catArg} | Total: ${products.length} | Pendientes: ${pending.length}`);
  console.log(`   Innovation: ${innovPending.length} | PromoOpcion: ${promoPending.length}`);
  console.log(`   Workers: ${workers} | Modo: headless`);
  console.log('─'.repeat(60));

  if (innovPending.length === 0 && promoPending.length === 0) {
    console.log('✅ Todo ya tiene precio. Usa --force para re-scrapear nulls.');
    return;
  }

  const browser: Browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const newPrices: Record<string, number | null> = {};

  // ── Innovation ──
  if (innovPending.length > 0) {
    console.log(`\n🔵 Innovation (${innovPending.length} productos, ${workers} workers)…`);
    const context = await browser.newContext({ userAgent: UA, locale: 'es-MX', viewport: { width: 1280, height: 800 } });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      (window as any).chrome = { runtime: {} };
    });
    const loginPage = await loginInnovation(context);

    const chunks = chunk(innovPending, workers);
    const pages: Page[] = [loginPage];
    for (let i = 1; i < workers && i < chunks.length; i++) {
      const p = await context.newPage();
      pages.push(p);
    }

    const progress = { done: 0, total: innovPending.length };
    await Promise.all(
      chunks.map((ch, i) =>
        scrapeWorker(pages[i] ?? loginPage, ch, innovUrl, extractPriceInnov, 3500, newPrices, 'innov', progress)
      )
    );
    console.log('\n');
    await context.close();
  }

  // ── PromoOpcion ──
  if (promoPending.length > 0) {
    console.log(`\n🟡 PromoOpcion (${promoPending.length} productos, ${workers} workers)…`);
    const context = await browser.newContext({ userAgent: UA, locale: 'es-MX' });
    const loginPage = await loginPromoOpcion(context);

    const chunks = chunk(promoPending, workers);
    const pages: Page[] = [loginPage];
    for (let i = 1; i < workers && i < chunks.length; i++) {
      pages.push(await context.newPage());
    }

    const progress = { done: 0, total: promoPending.length };
    await Promise.all(
      chunks.map((ch, i) =>
        scrapeWorker(pages[i] ?? loginPage, ch, promoUrl, extractPricePromo, 0, newPrices, 'promo', progress)
      )
    );
    console.log('\n');
    await context.close();
  }

  await browser.close();

  const final = { ...existing, ...newPrices };
  savePrices(final);

  const withPrice = Object.values(final).filter(v => v != null).length;
  const total     = Object.keys(final).length;
  const inRange   = products.filter(p => {
    const pr = final[p.id];
    return pr != null && pr >= 500 && pr <= 600;
  });

  console.log(`\n✅ Guardado: ${withPrice}/${total} con precio`);
  if (inRange.length) {
    console.log(`\n🎯 ${inRange.length} producto(s) entre $500–$600:`);
    inRange.forEach(p => console.log(`   ${p.modelo} — ${p.nombre} — $${final[p.id]}`));
  }
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
