'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Search, Tag, RefreshCw,
  TrendingUp, AlertCircle, ExternalLink, Download, X,
} from 'lucide-react';

interface ProductRow {
  id: string;
  modelo: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  fuente: 'innovation' | 'promoopcion';
}

const CAT_LABELS: Record<string, string> = {
  todas: 'Todas',
  kits: 'Kits',
  bebidas: 'Bebidas',
  tecnologia: 'Tecnología',
  escritura: 'Escritura',
  ejecutiva: 'Ejecutiva',
  textiles: 'Textiles',
  mochilas: 'Mochilas',
  hieleras: 'Hieleras',
  hogar: 'Hogar',
  belleza: 'Belleza',
  varios: 'Varios',
};

function supplierUrl(row: ProductRow) {
  if (row.fuente === 'innovation') {
    return `https://innovation.com.mx/producto/${row.modelo.toLowerCase()}`;
  }
  return `https://www.promoopcion.com/${row.modelo.toLowerCase().replace(/\s+/g, '-')}.html`;
}

function FuenteBadge({ fuente }: { fuente: 'innovation' | 'promoopcion' }) {
  return fuente === 'innovation'
    ? <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-violet-900/50 text-violet-300">Innov</span>
    : <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-900/50 text-blue-300">Promo</span>;
}

function exportCSV(rows: ProductRow[]) {
  const header = 'Modelo,Nombre,Categoría,Fuente,Precio\n';
  const body = rows.map(r =>
    `"${r.modelo}","${r.nombre.replace(/"/g, '""')}","${r.categoria}","${r.fuente}","${r.precio ?? ''}"`
  ).join('\n');
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'precios-sozo.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function PreciosPage() {
  const [all, setAll]           = useState<ProductRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [search, setSearch]     = useState('');
  const [cat, setCat]           = useState('todas');
  const [minP, setMinP]         = useState('500');
  const [maxP, setMaxP]         = useState('600');
  const [filterRange, setFilterRange] = useState(false);
  const [fuente, setFuente]     = useState<'todas' | 'innovation' | 'promoopcion'>('todas');
  const [sortBy, setSortBy]     = useState<'precio-asc' | 'precio-desc' | 'nombre'>('precio-asc');
  const searchRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/precios')
      .then(r => r.json())
      .then(d => {
        setAll(d.productos ?? []);
        setLastUpdate(new Date().toLocaleTimeString('es-MX'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Atajo "/" para enfocar búsqueda
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const min = parseFloat(minP) || 0;
  const max = parseFloat(maxP) || Infinity;

  const filtered = useMemo(() => {
    let rows = all;
    if (cat !== 'todas')    rows = rows.filter(p => p.categoria === cat);
    if (fuente !== 'todas') rows = rows.filter(p => p.fuente === fuente);
    if (filterRange)        rows = rows.filter(p => p.precio != null && p.precio >= min && p.precio <= max);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(p =>
        p.modelo.toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      if (sortBy === 'precio-asc')  return (a.precio ?? Infinity) - (b.precio ?? Infinity);
      if (sortBy === 'precio-desc') return (b.precio ?? -1) - (a.precio ?? -1);
      return a.nombre.localeCompare(b.nombre);
    });
  }, [all, cat, fuente, filterRange, min, max, search, sortBy]);

  const conPrecio = filtered.filter(p => p.precio != null).length;
  const enRango   = filtered.filter(p => p.precio != null && p.precio >= min && p.precio <= max).length;
  const sinPrecio = filtered.filter(p => p.precio == null).length;

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-zinc-400 font-mono flex items-center gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        Cargando precios…
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-6 py-3 flex items-center gap-4">
        <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#FF007F]" />
          <h1 className="text-base font-black tracking-tight">Precios del Catálogo</h1>
          {lastUpdate && (
            <span className="text-zinc-600 text-xs font-mono ml-2">· {lastUpdate}</span>
          )}
        </div>

        {/* Buscador principal — siempre visible */}
        <div className="relative flex-1 max-w-sm ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar modelo o nombre… (/)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-sm pl-9 pr-8 py-2 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FF007F] font-mono"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button onClick={load} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors" title="Recargar">
            <RefreshCw className="w-4 h-4 text-zinc-400" />
          </button>
          <a href="https://innovation.com.mx" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 text-xs font-bold rounded transition-colors">
            <ExternalLink className="w-3 h-3" />Innovation
          </a>
          <a href="https://www.promoopcion.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 text-xs font-bold rounded transition-colors">
            <ExternalLink className="w-3 h-3" />PromoOp
          </a>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Mostrados',    val: filtered.length,          cls: 'border-zinc-800' },
            { label: 'Con precio',   val: conPrecio,                cls: 'border-zinc-800' },
            { label: `$${minP}–$${maxP}`, val: enRango,            cls: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400' },
            { label: 'Sin precio',   val: sinPrecio,                cls: 'border-zinc-800 text-zinc-600' },
          ].map(({ label, val, cls }) => (
            <div key={label} className={`bg-zinc-900 border rounded-xl px-4 py-3 ${cls}`}>
              <p className="text-zinc-500 text-xs font-mono mb-0.5">{label}</p>
              <p className={`text-2xl font-black ${cls.includes('emerald') ? 'text-emerald-400' : cls.includes('zinc-600') ? 'text-zinc-600' : ''}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Categoría */}
          <select value={cat} onChange={e => setCat(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-sm px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#FF007F]">
            {Object.entries(CAT_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          {/* Fuente */}
          <select value={fuente} onChange={e => setFuente(e.target.value as typeof fuente)}
            className="bg-zinc-800 border border-zinc-700 text-sm px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#FF007F]">
            <option value="todas">Todas las fuentes</option>
            <option value="innovation">Innovation</option>
            <option value="promoopcion">PromoOpcion</option>
          </select>

          {/* Ordenar */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-zinc-800 border border-zinc-700 text-sm px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#FF007F]">
            <option value="precio-asc">Precio ↑</option>
            <option value="precio-desc">Precio ↓</option>
            <option value="nombre">Nombre A–Z</option>
          </select>

          {/* Rango de precio */}
          <label className="flex items-center gap-2 cursor-pointer ml-1">
            <input type="checkbox" checked={filterRange} onChange={e => setFilterRange(e.target.checked)}
              className="w-4 h-4 accent-[#FF007F]" />
            <span className="text-sm font-mono text-zinc-300">Rango</span>
          </label>
          <span className="text-zinc-600 font-mono text-sm">$</span>
          <input type="number" value={minP} onChange={e => setMinP(e.target.value)}
            className="w-20 bg-zinc-800 border border-zinc-700 text-sm px-2 py-2 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#FF007F]" />
          <span className="text-zinc-600 font-mono text-sm">—</span>
          <span className="text-zinc-600 font-mono text-sm">$</span>
          <input type="number" value={maxP} onChange={e => setMaxP(e.target.value)}
            className="w-24 bg-zinc-800 border border-zinc-700 text-sm px-2 py-2 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#FF007F]" />
        </div>

        {/* ── Tabla ── */}
        {all.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 font-mono text-sm mb-2">No hay precios todavía</p>
            <p className="text-zinc-600 text-xs font-mono">
              Corre: <code className="text-[#FF007F]">npx tsx scripts/scrape-prices.ts --cat all</code>
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Modelo</th>
                    <th className="text-left px-4 py-3">Nombre</th>
                    <th className="text-left px-4 py-3">Categoría</th>
                    <th className="text-left px-4 py-3">Fuente</th>
                    <th className="text-right px-4 py-3">Precio</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-zinc-600 font-mono text-sm">
                        Sin resultados para &ldquo;{search}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p, i) => {
                      const inRange = p.precio != null && p.precio >= min && p.precio <= max;
                      return (
                        <tr key={p.id}
                          className={`border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors ${inRange ? 'bg-emerald-950/25' : ''}`}
                        >
                          <td className="px-4 py-2.5 text-zinc-600 font-mono text-xs">{i + 1}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-zinc-400 whitespace-nowrap">{p.modelo}</td>
                          <td className="px-4 py-2.5 max-w-xs">
                            <span className="font-medium text-white truncate block">{p.nombre}</span>
                            {inRange && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-800/50 text-emerald-300 px-1.5 py-0.5 rounded font-mono uppercase mt-0.5">
                                <TrendingUp className="w-2.5 h-2.5" />en rango
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded capitalize">
                              {p.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-2.5"><FuenteBadge fuente={p.fuente} /></td>
                          <td className="px-4 py-2.5 text-right">
                            {p.precio != null ? (
                              <span className={`font-mono font-bold text-sm ${inRange ? 'text-emerald-400' : 'text-zinc-200'}`}>
                                ${p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-zinc-700 font-mono text-sm">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <a href={supplierUrl(p)} target="_blank" rel="noopener noreferrer"
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
                              title="Ver en proveedor">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
              <p className="text-zinc-600 text-xs font-mono">{filtered.length} resultados</p>
              {enRango > 0 && (
                <p className="text-emerald-400 text-xs font-mono font-bold">
                  {enRango} en rango ${minP}–${maxP}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Info scraper ── */}
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
          <p className="text-zinc-600 text-xs font-mono mb-2">Actualizar precios:</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {[
              ['npx tsx scripts/scrape-prices.ts --cat kits', 'Solo kits (178)'],
              ['npx tsx scripts/scrape-prices.ts --cat all', 'Todo el catálogo (~6,700)'],
              ['npx tsx scripts/scrape-prices.ts --source innov --cat all', 'Solo Innovation'],
              ['npx tsx scripts/scrape-prices.ts --source promo --cat all', 'Solo PromoOpcion'],
            ].map(([cmd, desc]) => (
              <div key={cmd} className="flex items-center gap-2">
                <code className="text-[#FF007F] text-[11px] font-mono">{cmd}</code>
                <span className="text-zinc-700 text-xs">— {desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
