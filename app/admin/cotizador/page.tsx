'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Search, Plus, Trash2, Copy, Check,
  Package, Calculator, ChevronDown, ChevronUp, X,
  Printer, AlertCircle,
} from 'lucide-react';

interface ProductRow {
  id: string;
  modelo: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  fuente: 'innovation' | 'promoopcion';
}

interface KitItem {
  product: ProductRow;
  qty: number; // unidades por kit (generalmente 1)
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function kitCost(items: KitItem[]) {
  return items.reduce((acc, it) => acc + (it.product.precio ?? 0) * it.qty, 0);
}

function totalCost(items: KitItem[], kits: number) {
  return kitCost(items) * kits;
}

function withMargin(base: number, pct: number) {
  return base * (1 + pct / 100);
}

// ─── Buscador flotante ────────────────────────────────────────────────────────

function ProductSearch({
  catalog,
  kitIds,
  onAdd,
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
      .filter(p =>
        p.modelo.toLowerCase().includes(lower) ||
        p.nombre.toLowerCase().includes(lower)
      )
      .slice(0, 12);
  }, [q, catalog]);

  useEffect(() => {
    setOpen(results.length > 0 && q.trim().length >= 2);
  }, [results, q]);

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 focus-within:ring-1 focus-within:ring-[#FF007F] transition-all">
        <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar por modelo o nombre (ej. BL-207, Taza, Mouse pad…)"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-mono"
        />
        {q && (
          <button onClick={() => { setQ(''); setOpen(false); }} className="text-zinc-600 hover:text-zinc-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.map(p => {
            const already = kitIds.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => { if (!already) { onAdd(p); setQ(''); setOpen(false); } }}
                disabled={already}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${already ? 'opacity-40 cursor-default' : 'hover:bg-zinc-800 cursor-pointer'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-500">{p.modelo}</span>
                    <span className="text-xs text-zinc-200 truncate">{p.nombre}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 capitalize">{p.categoria}</span>
                </div>
                <div className="flex-shrink-0 text-right">
                  {p.precio != null
                    ? <span className="font-mono text-sm font-bold text-emerald-400">${fmt(p.precio)}</span>
                    : <span className="text-xs text-zinc-600 font-mono">sin precio</span>}
                </div>
                {already
                  ? <Check className="w-4 h-4 text-zinc-600" />
                  : <Plus className="w-4 h-4 text-zinc-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Vista de impresión / copia ───────────────────────────────────────────────

function QuotePreview({
  items,
  kits,
  margin,
  cliente,
}: {
  items: KitItem[];
  kits: number;
  margin: number;
  cliente: string;
}) {
  const [copied, setCopied] = useState(false);

  const perKit   = kitCost(items);
  const subtotal = totalCost(items, kits);
  const final    = withMargin(subtotal, margin);
  const perKitFinal = withMargin(perKit, margin);

  const text = [
    `COTIZACIÓN DE KIT — SOZO`,
    cliente ? `Cliente: ${cliente}` : '',
    `Fecha: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    '',
    `Cantidad de kits: ${kits}`,
    '',
    'ARTÍCULOS POR KIT:',
    ...items.map((it, i) =>
      `  ${i + 1}. ${it.product.nombre} (${it.product.modelo})` +
      (it.product.precio != null ? ` — $${fmt(it.product.precio * it.qty)} c/u` : ' — precio a confirmar')
    ),
    '',
    `Costo por kit:     $${fmt(perKitFinal)}`,
    `Total ${kits} kits:       $${fmt(final)}`,
    '',
    'Precios sujetos a cambio. No incluyen impresión personalizada.',
  ].filter(l => l !== null).join('\n');

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Vista previa de cotización</span>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>
      <pre className="px-5 py-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
        {text}
      </pre>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CotizadorPage() {
  const [catalog, setCatalog]   = useState<ProductRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [items, setItems]       = useState<KitItem[]>([]);
  const [kits, setKits]         = useState(10);
  const [margin, setMargin]     = useState(35);
  const [cliente, setCliente]   = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch('/api/admin/precios')
      .then(r => r.json())
      .then(d => { setCatalog(d.productos ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const kitIds = useMemo(() => new Set(items.map(it => it.product.id)), [items]);

  const addProduct = useCallback((p: ProductRow) => {
    setItems(prev => [...prev, { product: p, qty: 1 }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(it => it.product.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems(prev => prev.map(it => it.product.id === id ? { ...it, qty: Math.max(1, qty) } : it));
  }, []);

  const moveItem = useCallback((idx: number, dir: -1 | 1) => {
    setItems(prev => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const perKit      = kitCost(items);
  const subtotal    = totalCost(items, kits);
  const finalTotal  = withMargin(subtotal, margin);
  const perKitFinal = withMargin(perKit, margin);

  const withoutPrice = items.filter(it => it.product.precio == null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white print:bg-white print:text-black">

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-6 py-3 flex items-center gap-4 print:hidden">
        <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#FF007F]" />
          <h1 className="text-base font-black tracking-tight">Cotizador de Kits</h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setShowPreview(v => !v)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#FF007F] hover:bg-[#e0006e] text-white text-sm font-bold rounded-xl transition-colors"
          >
            <Copy className="w-4 h-4" />
            {showPreview ? 'Ocultar cotización' : 'Ver cotización'}
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* ── Parámetros ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-2">
            <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">Cliente</label>
            <input
              type="text"
              placeholder="Nombre del cliente (opcional)"
              value={cliente}
              onChange={e => setCliente(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-sm px-3 py-2.5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF007F] font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">Núm. de kits</label>
            <input
              type="number"
              min={1}
              value={kits}
              onChange={e => setKits(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-zinc-900 border border-zinc-700 text-sm px-3 py-2.5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#FF007F] font-mono text-center text-lg font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">Margen %</label>
            <input
              type="number"
              min={0}
              max={200}
              value={margin}
              onChange={e => setMargin(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-zinc-900 border border-zinc-700 text-sm px-3 py-2.5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#FF007F] font-mono text-center text-lg font-bold"
            />
          </div>
        </div>

        {/* ── Buscador ── */}
        {loading ? (
          <div className="text-zinc-500 font-mono text-sm flex items-center gap-2">
            <Search className="w-4 h-4 animate-pulse" />
            Cargando catálogo…
          </div>
        ) : (
          <ProductSearch catalog={catalog} kitIds={kitIds} onAdd={addProduct} />
        )}

        {/* ── Items del kit ── */}
        {items.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 font-mono text-sm">El kit está vacío</p>
            <p className="text-zinc-700 text-xs mt-1">Busca productos arriba para agregarlos</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Artículos del kit — {items.length} producto{items.length !== 1 ? 's' : ''}
              </span>
              {withoutPrice.length > 0 && (
                <span className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {withoutPrice.length} sin precio
                </span>
              )}
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-[11px] font-mono uppercase text-zinc-600 tracking-wider border-b border-zinc-800">
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-4 py-2">Modelo</th>
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-center px-4 py-2">Qty/kit</th>
                  <th className="text-right px-4 py-2">Precio unit.</th>
                  <th className="text-right px-4 py-2">× {kits} kits</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.product.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20">
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">{it.product.modelo}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white">{it.product.nombre}</span>
                      <span className="block text-[10px] text-zinc-600 capitalize mt-0.5">{it.product.categoria}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={e => updateQty(it.product.id, parseInt(e.target.value) || 1)}
                        className="w-14 bg-zinc-800 border border-zinc-700 text-center text-sm font-mono text-white py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {it.product.precio != null
                        ? <span className="text-zinc-200">${fmt(it.product.precio * it.qty)}</span>
                        : <span className="text-amber-500 text-xs">sin precio</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {it.product.precio != null
                        ? <span className="font-bold text-white">${fmt(it.product.precio * it.qty * kits)}</span>
                        : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => removeItem(it.product.id)}
                        className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales */}
            <div className="border-t border-zinc-700 bg-zinc-800/40 px-4 py-4 space-y-2">
              <div className="flex justify-between text-sm font-mono text-zinc-400">
                <span>Costo por kit (costo base)</span>
                <span>${fmt(perKit)}</span>
              </div>
              <div className="flex justify-between text-sm font-mono text-zinc-400">
                <span>Total {kits} kits (costo base)</span>
                <span>${fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-mono text-zinc-500">
                <span>Margen aplicado ({margin}%)</span>
                <span>+${fmt(subtotal * margin / 100)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
                <span className="font-black text-base text-white">Total con margen</span>
                <span className="font-black text-2xl text-[#FF007F]">${fmt(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-500">
                <span>Precio por kit con margen</span>
                <span className="text-zinc-300 font-bold">${fmt(perKitFinal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Vista previa ── */}
        {showPreview && items.length > 0 && (
          <QuotePreview items={items} kits={kits} margin={margin} cliente={cliente} />
        )}

      </div>
    </div>
  );
}
