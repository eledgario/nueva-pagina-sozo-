'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search, Plus, Trash2, Copy, Check,
  Package, Calculator, ChevronDown, ChevronUp, X,
  Printer, AlertCircle, ClipboardList, Percent, Zap,
  ExternalLink, ShieldCheck, ShieldX, Loader2, ListCollapse,
} from 'lucide-react';

interface ProductRow {
  id: string;
  modelo: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  fuente: 'innovation' | 'promoopcion' | 'moplayeras';
}

interface PrintingTier { min: number; max: number | null; precio: number; }
interface PrintingOption { id: string; tecnica: string; descripcion: string; tiers: PrintingTier[]; }

interface KitItem {
  product: ProductRow;
  qty: number;
  margenExtra: number;
  costoImpresion: number;   // usado cuando printingId es null (manual)
  printingId: string | null; // si está definido, el costo se calcula del catálogo
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// M&O descuentos por volumen — se aplican al costo ANTES del margen
const MOP_TIERS = [
  { min: 1,   max: 10,  discount: 10 },
  { min: 11,  max: 29,  discount: 20 },
  { min: 30,  max: 99,  discount: 25 },
  { min: 100, max: Infinity, discount: 38 },
] as const;

function mopTier(totalQty: number) {
  return MOP_TIERS.find(t => totalQty >= t.min && totalQty <= t.max) ?? MOP_TIERS[0];
}

function resolveImpresion(it: KitItem, kits: number, printingOptions: PrintingOption[]): number {
  if (!it.printingId) return it.costoImpresion;
  const opt = printingOptions.find(o => o.id === it.printingId);
  if (!opt) return it.costoImpresion;
  const totalQty = it.qty * kits;
  const tier = opt.tiers.find(t => totalQty >= t.min && (t.max === null || totalQty <= t.max));
  return tier?.precio ?? 0;
}

function itemFinalPrice(it: KitItem, globalMargin: number, kits: number, printingOptions: PrintingOption[]): number {
  if (it.product.precio == null) return 0;
  let costo = it.product.precio;
  if (it.product.id.startsWith('mop_')) {
    const tier = mopTier(it.qty * kits);
    costo = costo * (1 - tier.discount / 100);
  }
  const base = costo * it.qty;
  const conMargen = base * (1 + (globalMargin + it.margenExtra) / 100);
  const imp = resolveImpresion(it, kits, printingOptions);
  return conMargen + imp * it.qty;
}

function kitTotal(items: KitItem[], globalMargin: number, kits: number, printingOptions: PrintingOption[]): number {
  return items.reduce((acc, it) => acc + itemFinalPrice(it, globalMargin, kits, printingOptions), 0);
}

// ─── Buscador de productos ────────────────────────────────────────────────────

function ProductSearch({
  catalog, kitIds, onAdd,
}: {
  catalog: ProductRow[];
  kitIds: Set<string>;
  onAdd: (p: ProductRow) => void;
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lower = q.toLowerCase();
    return catalog
      .filter(p => p.modelo.toLowerCase().includes(lower) || p.nombre.toLowerCase().includes(lower))
      .slice(0, 10);
  }, [q, catalog]);

  useEffect(() => { setOpen(results.length > 0); }, [results]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-600 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-[#FF007F] transition-all">
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Busca por modelo (BL-207) o nombre (Bolígrafo, Taza, Mouse pad…)"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
        />
        {q && (
          <button onClick={() => { setQ(''); setOpen(false); }} className="text-zinc-600 hover:text-zinc-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto">
          {results.map(p => {
            const already = kitIds.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => { if (!already) { onAdd(p); setQ(''); setOpen(false); } }}
                disabled={already}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-zinc-800 last:border-0
                  ${already ? 'opacity-35 cursor-default' : 'hover:bg-zinc-800 cursor-pointer'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 flex-shrink-0">{p.modelo}</span>
                    <span className="text-sm text-white truncate">{p.nombre}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 capitalize">{p.categoria}</span>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {p.precio != null
                    ? <span className="font-mono text-sm font-bold text-emerald-400">${fmt(p.precio)}</span>
                    : <span className="text-xs text-zinc-600 font-mono">sin precio</span>}
                  {already
                    ? <Check className="w-4 h-4 text-zinc-600" />
                    : <Plus className="w-4 h-4 text-[#FF007F]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Pegar lista de modelos ───────────────────────────────────────────────────

function PasteList({
  catalog, kitIds, onAddMany,
}: {
  catalog: ProductRow[];
  kitIds: Set<string>;
  onAddMany: (ps: ProductRow[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ found: ProductRow[]; notFound: string[] } | null>(null);

  const parse = () => {
    const tokens = text
      .split(/[\n,;]+/)
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);

    const found: ProductRow[] = [];
    const notFound: string[] = [];

    for (const token of tokens) {
      const match = catalog.find(
        p => p.modelo.toUpperCase() === token || p.modelo.toUpperCase().replace(/[\s-]/g, '') === token.replace(/[\s-]/g, '')
      );
      if (match && !kitIds.has(match.id) && !found.find(f => f.id === match.id)) {
        found.push(match);
      } else if (!match) {
        notFound.push(token);
      }
    }
    setPreview({ found, notFound });
  };

  const apply = () => {
    if (preview) {
      onAddMany(preview.found);
      setText('');
      setPreview(null);
      setOpen(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 transition-colors"
      >
        <ClipboardList className="w-3.5 h-3.5" />
        Pegar lista de modelos
      </button>

      {open && (
        <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-3">
          <p className="text-xs text-zinc-400">
            Pega los modelos separados por coma, punto y coma o salto de línea:
          </p>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setPreview(null); }}
            placeholder={'BL-207, TE-259, DK-067\nHL 2100 A\n3541'}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF007F] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={parse}
              disabled={!text.trim()}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-sm font-bold text-white rounded-lg transition-colors"
            >
              Buscar modelos
            </button>
            {preview && (
              <button
                onClick={apply}
                disabled={preview.found.length === 0}
                className="px-4 py-2 bg-[#FF007F] hover:bg-[#e0006e] disabled:opacity-40 text-sm font-bold text-white rounded-lg transition-colors"
              >
                Agregar {preview.found.length} producto{preview.found.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>

          {preview && (
            <div className="space-y-2 text-xs font-mono">
              {preview.found.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{p.modelo} — {p.nombre}</span>
                  {p.precio != null && <span className="ml-auto">${fmt(p.precio)}</span>}
                </div>
              ))}
              {preview.notFound.map(m => (
                <div key={m} className="flex items-center gap-2 text-amber-500">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{m} — no encontrado</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Vista previa de cotización ───────────────────────────────────────────────

function QuotePreview({ items, kits, globalMargin, cliente, printingOptions }: {
  items: KitItem[];
  kits: number;
  globalMargin: number;
  cliente: string;
  printingOptions: PrintingOption[];
}) {
  const [copied, setCopied] = useState(false);

  const perKit = kitTotal(items, globalMargin, kits, printingOptions);
  const total  = perKit * kits;

  const text = [
    'COTIZACIÓN DE KIT — SOZO',
    cliente ? `Cliente: ${cliente}` : '',
    `Fecha: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    `Cantidad de kits: ${kits}`,
    '',
    'ARTÍCULOS POR KIT:',
    ...items.map((it, i) => {
      const precio = itemFinalPrice(it, globalMargin, kits, printingOptions);
      const imp = resolveImpresion(it, kits, printingOptions);
      const printLabel = it.printingId
        ? printingOptions.find(o => o.id === it.printingId)?.descripcion
        : null;
      return `  ${i + 1}. ${it.product.nombre} (${it.product.modelo})` +
        (precio > 0 ? ` — $${fmt(precio)}` : ' — precio a confirmar') +
        (imp > 0 ? ` (incl. impresión${printLabel ? ` ${printLabel}` : ''} $${fmt(imp)}/u)` : '');
    }),
    '',
    `Precio por kit:   $${fmt(perKit)}`,
    `Total ${kits} kits: $${fmt(total)}`,
    '',
    'Precios sujetos a cambio.',
  ].filter(Boolean).join('\n');

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Vista previa</span>
        <div className="flex gap-2">
          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 rounded-lg transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar texto'}
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 rounded-lg transition-colors">
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>
      <pre className="px-5 py-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">{text}</pre>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CotizadorPage() {
  const [catalog, setCatalog] = useState<ProductRow[]>([]);
  const [printingOptions, setPrintingOptions] = useState<PrintingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems]     = useState<KitItem[]>([]);
  const [kits, setKits]       = useState(10);
  const [globalMargin, setGlobalMargin] = useState(35);
  const [cliente, setCliente] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [stockStatus, setStockStatus] = useState<Record<string, 'idle' | 'loading' | 'ok' | 'out' | 'manual'>>({});
  const [stockUrl, setStockUrl] = useState<Record<string, string>>({});

  type ColorsData = { colors: { name: string; available: boolean; url: string }[]; sizes: { title: string; price: string }[] };
  const [colorsData, setColorsData] = useState<Record<string, ColorsData | 'loading'>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/precios').then(r => r.json()),
      fetch('/api/admin/impresion').then(r => r.json()),
    ]).then(([precios, impr]) => {
      setCatalog(precios.productos ?? []);
      setPrintingOptions(impr ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const kitIds = useMemo(() => new Set(items.map(it => it.product.id)), [items]);

  const addProduct = useCallback((p: ProductRow) => {
    setItems(prev => [...prev, { product: p, qty: 1, margenExtra: 0, costoImpresion: 0, printingId: null }]);
  }, []);

  const addMany = useCallback((ps: ProductRow[]) => {
    setItems(prev => [
      ...prev,
      ...ps.filter(p => !prev.find(it => it.product.id === p.id))
            .map(p => ({ product: p, qty: 1, margenExtra: 0, costoImpresion: 0, printingId: null })),
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(it => it.product.id !== id));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<Omit<KitItem, 'product'>>) => {
    setItems(prev => prev.map(it => it.product.id === id ? { ...it, ...patch } : it));
  }, []);

  const checkStock = useCallback(async (it: KitItem) => {
    setStockStatus(prev => ({ ...prev, [it.product.id]: 'loading' }));
    try {
      const res = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: it.product.id, modelo: it.product.modelo }),
      });
      const data = await res.json() as { available: boolean | null; url: string };
      setStockUrl(prev => ({ ...prev, [it.product.id]: data.url }));
      if (data.available === true)  setStockStatus(prev => ({ ...prev, [it.product.id]: 'ok' }));
      else if (data.available === false) setStockStatus(prev => ({ ...prev, [it.product.id]: 'out' }));
      else setStockStatus(prev => ({ ...prev, [it.product.id]: 'manual' }));
    } catch {
      setStockStatus(prev => ({ ...prev, [it.product.id]: 'idle' }));
    }
  }, []);

  const loadColors = useCallback(async (it: KitItem) => {
    const id = it.product.id;
    if (colorsData[id]) {
      setColorsData(prev => { const n = { ...prev }; delete n[id]; return n; });
      return;
    }
    setColorsData(prev => ({ ...prev, [id]: 'loading' }));
    try {
      const res = await fetch(`/api/admin/stock/mop-variants?modelo=${encodeURIComponent(it.product.modelo)}`);
      const data = await res.json() as { colors: { name: string; available: boolean; url: string }[]; sizes: { title: string; price: string }[] };
      setColorsData(prev => ({ ...prev, [id]: data }));
    } catch {
      setColorsData(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  }, [colorsData]);

  const checkAllStock = useCallback(() => {
    items.forEach(it => {
      if (stockStatus[it.product.id] !== 'loading') checkStock(it);
    });
  }, [items, stockStatus, checkStock]);

  const moveItem = useCallback((idx: number, dir: -1 | 1) => {
    setItems(prev => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const perKit = kitTotal(items, globalMargin, kits, printingOptions);
  const total  = perKit * kits;
  const withoutPrice = items.filter(it => it.product.precio == null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ── Encabezado ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-[#FF007F]" />
            <h1 className="text-xl font-black tracking-tight">Cotizador de Kits</h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Arma el contenido de <strong className="text-zinc-300">un kit</strong>, define cuántos necesitas y agrega tu margen y costos de impresión.
          </p>
        </div>

        {/* ── Paso 1: Datos generales ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#FF007F] text-white text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="text-sm font-bold text-zinc-200">Datos generales</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-8">
            <div className="col-span-2">
              <label className="block text-[11px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">Cliente</label>
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={cliente}
                onChange={e => setCliente(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-sm px-3 py-2.5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">Núm. de kits</label>
              <input
                type="number" min={1} value={kits}
                onChange={e => setKits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-zinc-900 border border-zinc-700 text-sm px-3 py-2.5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#FF007F] font-mono text-center text-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">Margen global %</label>
              <input
                type="number" min={0} max={500} value={globalMargin}
                onChange={e => setGlobalMargin(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-zinc-900 border border-zinc-700 text-sm px-3 py-2.5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#FF007F] font-mono text-center text-lg font-bold"
              />
            </div>
          </div>
        </section>

        {/* ── Paso 2: Agregar productos al kit ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#FF007F] text-white text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
            <h2 className="text-sm font-bold text-zinc-200">¿Qué va dentro de cada kit?</h2>
          </div>
          <div className="pl-8 space-y-2">
            <p className="text-xs text-zinc-500">Busca y agrega cada artículo que llevará el kit. Puedes ajustar la cantidad, margen extra e impresión por producto.</p>
            {loading ? (
              <div className="text-zinc-500 font-mono text-sm flex items-center gap-2 py-2">
                <Search className="w-4 h-4 animate-pulse" /> Cargando catálogo…
              </div>
            ) : (
              <div className="space-y-2">
                <ProductSearch catalog={catalog} kitIds={kitIds} onAdd={addProduct} />
                <PasteList catalog={catalog} kitIds={kitIds} onAddMany={addMany} />
              </div>
            )}
          </div>
        </section>

        {/* ── Paso 3: Kit armado ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#FF007F] text-white text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
            <h2 className="text-sm font-bold text-zinc-200">Kit armado</h2>
            {withoutPrice.length > 0 && (
              <span className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5" />{withoutPrice.length} sin precio
              </span>
            )}
            {items.length > 0 && (
              <button
                onClick={checkAllStock}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-300 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verificar disponibilidad
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="pl-8">
              <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-10 text-center">
                <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm font-medium">Kit vacío</p>
                <p className="text-zinc-700 text-xs mt-1">Usa el buscador del paso 2 para agregar productos</p>
              </div>
            </div>
          ) : (
            <div className="pl-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {/* Encabezados */}
                <div className="grid gap-0 border-b border-zinc-800 bg-zinc-800/30 px-4 py-2 text-[11px] font-mono uppercase text-zinc-600 tracking-wider"
                  style={{ gridTemplateColumns: '24px 1fr 70px 90px 90px 90px 32px' }}>
                  <span></span>
                  <span>Producto</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center flex items-center justify-center gap-1"><Percent className="w-3 h-3" />Extra</span>
                  <span className="text-center flex items-center justify-center gap-1"><Printer className="w-3 h-3" />Impresión</span>
                  <span className="text-right">Precio/kit</span>
                  <span></span>
                </div>

                {items.map((it, idx) => {
                  const linePrice = itemFinalPrice(it, globalMargin, kits, printingOptions);
                  const impCosto = resolveImpresion(it, kits, printingOptions);
                  const isMop = it.product.id.startsWith('mop_');
                  const mopDisc = isMop ? mopTier(it.qty * kits) : null;
                  const cd = colorsData[it.product.id];
                  return (
                    <div key={it.product.id} className="border-b border-zinc-800/50">
                    <div
                      className="grid items-center gap-0 px-4 py-3 hover:bg-zinc-800/20 transition-colors group"
                      style={{ gridTemplateColumns: '24px 1fr 70px 90px 90px 90px 32px' }}
                    >
                      {/* Reordenar */}
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button>
                        <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button>
                      </div>

                      {/* Nombre */}
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm text-white font-medium truncate">{it.product.nombre}</p>
                          {mopDisc && (
                            <span className="flex-shrink-0 text-[10px] font-bold font-mono bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded">
                              M&O -{mopDisc.discount}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[10px] font-mono text-zinc-500">{it.product.modelo}
                            {it.product.precio != null && (
                              mopDisc
                                ? <span className="ml-2 text-zinc-600">
                                    base ${fmt(it.product.precio)} →{' '}
                                    <span className="text-amber-500">${fmt(it.product.precio * (1 - mopDisc.discount / 100))}</span>
                                    {' '}({it.qty * kits} pzas)
                                  </span>
                                : <span className="ml-2 text-zinc-600">costo ${fmt(it.product.precio)}</span>
                            )}
                          </p>
                          {/* Stock indicator */}
                          {stockStatus[it.product.id] === 'idle' && (
                            <button
                              onClick={() => checkStock(it)}
                              className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 underline underline-offset-2 transition-colors"
                            >
                              verificar stock
                            </button>
                          )}
                          {stockStatus[it.product.id] === 'loading' && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                              <Loader2 className="w-3 h-3 animate-spin" /> verificando…
                            </span>
                          )}
                          {stockStatus[it.product.id] === 'ok' && (
                            <a href={stockUrl[it.product.id]} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors">
                              <ShieldCheck className="w-3 h-3" /> En stock
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </a>
                          )}
                          {stockStatus[it.product.id] === 'out' && (
                            <a href={stockUrl[it.product.id]} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors">
                              <ShieldX className="w-3 h-3" /> Sin stock
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </a>
                          )}
                          {stockStatus[it.product.id] === 'manual' && (
                            <a href={stockUrl[it.product.id]} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors">
                              <ExternalLink className="w-2.5 h-2.5" /> Ver en proveedor
                            </a>
                          )}
                          {it.printingId && (() => {
                            const opt = printingOptions.find(o => o.id === it.printingId);
                            return opt ? (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-violet-400">
                                <Printer className="w-2.5 h-2.5" />
                                {opt.tecnica.split('/')[0].trim()} · {opt.descripcion} · ${fmt(impCosto)}/u
                              </span>
                            ) : null;
                          })()}
                          {isMop && (
                            <button
                              onClick={() => loadColors(it)}
                              className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 underline underline-offset-2 transition-colors"
                            >
                              {colorsData[it.product.id] ? 'ocultar colores' : 'ver colores/tallas'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Qty */}
                      <div className="flex justify-center">
                        <input
                          type="number" min={1} value={it.qty}
                          onChange={e => updateItem(it.product.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-14 bg-zinc-800 border border-zinc-700 text-center text-sm font-mono text-white py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
                        />
                      </div>

                      {/* Margen extra */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <input
                            type="number" min={0} max={500} value={it.margenExtra}
                            onChange={e => updateItem(it.product.id, { margenExtra: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-16 bg-zinc-800 border border-zinc-700 text-center text-sm font-mono text-white py-1.5 pr-5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">%</span>
                        </div>
                      </div>

                      {/* Costo impresión */}
                      <div className="flex justify-center">
                        {it.printingId ? (
                          // Precio auto desde catálogo
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-sm font-bold text-violet-300">${fmt(impCosto)}</span>
                            <button
                              onClick={() => updateItem(it.product.id, { printingId: null, costoImpresion: 0 })}
                              className="text-[10px] font-mono text-zinc-600 hover:text-red-400 transition-colors underline underline-offset-1"
                            >quitar</button>
                          </div>
                        ) : (
                          // Selector manual o desde catálogo
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">$</span>
                              <input
                                type="number" min={0} value={it.costoImpresion}
                                onChange={e => updateItem(it.product.id, { costoImpresion: Math.max(0, parseFloat(e.target.value) || 0) })}
                                className="w-20 bg-zinc-800 border border-zinc-700 text-center text-sm font-mono text-white py-1.5 pl-5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
                              />
                            </div>
                            {printingOptions.length > 0 && (
                              <select
                                value=""
                                onChange={e => { if (e.target.value) updateItem(it.product.id, { printingId: e.target.value, costoImpresion: 0 }); }}
                                className="w-20 bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-500 py-0.5 px-1 rounded focus:outline-none"
                              >
                                <option value="">catálogo…</option>
                                {printingOptions.map(o => (
                                  <option key={o.id} value={o.id}>{o.tecnica.split('/')[0].trim()} · {o.descripcion}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Precio final */}
                      <div className="text-right">
                        {linePrice > 0
                          ? <span className="font-mono font-bold text-sm text-white">${fmt(linePrice)}</span>
                          : <span className="text-amber-500 text-xs font-mono">sin precio</span>}
                      </div>

                      {/* Eliminar */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(it.product.id)}
                          className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Panel colores/tallas M&O */}
                    {isMop && cd && (
                      <div className="px-10 pb-4 pt-1 bg-zinc-800/20">
                        {cd === 'loading' ? (
                          <span className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cargando colores…
                          </span>
                        ) : (
                          <div className="space-y-3">
                            {/* Colores */}
                            <div>
                              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">
                                Colores ({cd.colors.length} de este modelo)
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {cd.colors.map(c => (
                                  <a
                                    key={c.url}
                                    href={c.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-colors
                                      ${c.available
                                        ? 'border-emerald-800 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/50'
                                        : 'border-zinc-700 bg-zinc-900 text-zinc-600 line-through'
                                      }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.available ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                                    {c.name}
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Tallas */}
                            {cd.sizes.length > 0 && (
                              <div>
                                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">
                                  Tallas disponibles
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {cd.sizes.map(s => (
                                    <span
                                      key={s.title}
                                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300"
                                    >
                                      {s.title}
                                      {parseFloat(s.price) > (cd.sizes[0] ? parseFloat(cd.sizes[0].price) : 0) && (
                                        <span className="ml-1 text-zinc-500">+${(parseFloat(s.price) - parseFloat(cd.sizes[0].price)).toFixed(2)}</span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-[10px] font-mono text-zinc-700 mt-2">
                                  * Disponibilidad por talla no disponible en API pública
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    </div>
                  );
                })}

                {/* Totales */}
                <div className="border-t border-zinc-700 bg-zinc-800/30 px-4 py-4 space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-2">
                    Margen global aplicado: {globalMargin}% · Productos: {items.length}
                  </div>
                  <div className="flex justify-between text-sm font-mono text-zinc-400">
                    <span>Precio por kit</span>
                    <span className="font-bold text-zinc-200">${fmt(perKit)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-700 mt-2">
                    <span className="font-black text-base text-white">Total {kits} kits</span>
                    <span className="font-black text-2xl text-[#FF007F]">${fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Paso 4: Generar cotización ── */}
        {items.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF007F] text-white text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              <h2 className="text-sm font-bold text-zinc-200">Generar cotización</h2>
              <button
                onClick={() => setShowPreview(v => !v)}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#FF007F] hover:bg-[#e0006e] text-white text-sm font-bold rounded-xl transition-colors"
              >
                <Copy className="w-4 h-4" />
                {showPreview ? 'Ocultar' : 'Ver cotización'}
              </button>
            </div>
            {showPreview && (
              <div className="pl-8">
                <QuotePreview items={items} kits={kits} globalMargin={globalMargin} cliente={cliente} printingOptions={printingOptions} />
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
