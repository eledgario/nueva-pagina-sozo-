'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Save, Printer, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface PrintingTier {
  min: number;
  max: number | null;
  precio: number;
}

interface PrintingOption {
  id: string;
  tecnica: string;
  descripcion: string;
  tiers: PrintingTier[];
}

const TECNICAS = ['Serigrafía', 'DTF / DTG', 'Sublimación', 'Grabado Láser', 'UV / Tampografía', 'Bordado'];

const DEFAULT_TIERS: PrintingTier[] = [
  { min: 1,   max: 24,  precio: 0 },
  { min: 25,  max: 49,  precio: 0 },
  { min: 50,  max: 99,  precio: 0 },
  { min: 100, max: null, precio: 0 },
];

function fmt(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Fila de opción ───────────────────────────────────────────────────────────

function OptionRow({
  option,
  onSave,
  onDelete,
}: {
  option: PrintingOption;
  onSave: (o: PrintingOption) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PrintingOption>(option);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(option);

  const updateTier = (i: number, field: keyof PrintingTier, val: string) => {
    setDraft(prev => {
      const tiers = [...prev.tiers];
      if (field === 'max') {
        tiers[i] = { ...tiers[i], max: val === '' ? null : Number(val) };
      } else {
        tiers[i] = { ...tiers[i], [field]: Number(val) };
      }
      return { ...prev, tiers };
    });
  };

  const addTier = () => {
    const last = draft.tiers[draft.tiers.length - 1];
    const newMin = last ? (last.max ?? last.min) + 1 : 1;
    setDraft(prev => ({
      ...prev,
      tiers: [...prev.tiers, { min: newMin, max: null, precio: 0 }],
    }));
  };

  const removeTier = (i: number) => {
    setDraft(prev => ({ ...prev, tiers: prev.tiers.filter((_, j) => j !== i) }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
          <span className="text-[10px] font-bold font-mono bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded whitespace-nowrap">
            {draft.tecnica}
          </span>
          <span className="text-sm text-white font-medium truncate">{draft.descripcion || 'Sin descripción'}</span>
          <span className="text-xs text-zinc-600 font-mono ml-auto whitespace-nowrap">
            {draft.tiers.length} rangos · desde ${fmt(Math.min(...draft.tiers.map(t => t.precio)))} /u
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
        </button>
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF007F] hover:bg-[#e0006e] disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors flex-shrink-0"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Guardado' : 'Guardar'}
          </button>
        )}
        <button
          onClick={() => onDelete(option.id)}
          className="text-zinc-700 hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
          {/* Técnica + descripción */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Técnica</label>
              <select
                value={draft.tecnica}
                onChange={e => setDraft(prev => ({ ...prev, tecnica: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
              >
                {TECNICAS.map(t => <option key={t}>{t}</option>)}
                <option value={draft.tecnica}>{!TECNICAS.includes(draft.tecnica) ? draft.tecnica : ''}</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Descripción</label>
              <input
                type="text"
                value={draft.descripcion}
                onChange={e => setDraft(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Ej: 1 color, full color, 10×10cm…"
                className="w-full bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F] placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Tiers */}
          <div>
            <div className="grid grid-cols-[1fr_1fr_1fr_28px] gap-2 mb-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider px-1">
              <span>Desde (pzas)</span>
              <span>Hasta (pzas)</span>
              <span>Precio / pieza</span>
              <span></span>
            </div>
            <div className="space-y-2">
              {draft.tiers.map((tier, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_28px] gap-2 items-center">
                  <input
                    type="number" min={1} value={tier.min}
                    onChange={e => updateTier(i, 'min', e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-sm font-mono text-white px-3 py-2 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
                  />
                  <input
                    type="number" min={tier.min + 1}
                    value={tier.max ?? ''}
                    placeholder="sin límite"
                    onChange={e => updateTier(i, 'max', e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-sm font-mono text-white px-3 py-2 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-[#FF007F] placeholder-zinc-600"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">$</span>
                    <input
                      type="number" min={0} step={0.01} value={tier.precio}
                      onChange={e => updateTier(i, 'precio', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 text-sm font-mono text-white pl-6 pr-3 py-2 rounded-lg text-right focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
                    />
                  </div>
                  <button
                    onClick={() => removeTier(i)}
                    disabled={draft.tiers.length <= 1}
                    className="text-zinc-700 hover:text-red-400 disabled:opacity-20 transition-colors flex justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addTier}
              className="mt-2 flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar rango
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Formulario nueva opción ───────────────────────────────────────────────────

function NewOptionForm({ onAdd }: { onAdd: (o: Omit<PrintingOption, 'id'>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [tecnica, setTecnica] = useState(TECNICAS[0]);
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!descripcion.trim()) return;
    setSaving(true);
    await onAdd({ tecnica, descripcion: descripcion.trim(), tiers: DEFAULT_TIERS });
    setSaving(false);
    setDescripcion('');
    setOpen(false);
  };

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors w-full"
        >
          <Plus className="w-4 h-4" />
          Agregar opción de impresión
        </button>
      ) : (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-zinc-300">Nueva opción</p>
          <div className="flex gap-3">
            <select
              value={tecnica}
              onChange={e => setTecnica(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F]"
            >
              {TECNICAS.map(t => <option key={t}>{t}</option>)}
            </select>
            <input
              type="text"
              autoFocus
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setOpen(false); }}
              placeholder="Descripción (ej: 1 color, full color, 10×10cm…)"
              className="flex-1 bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF007F] placeholder-zinc-600"
            />
          </div>
          <p className="text-xs text-zinc-600 font-mono">Se crearán 4 rangos de precio (1–24, 25–49, 50–99, 100+). Edítalos después.</p>
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={!descripcion.trim() || saving}
              className="px-4 py-2 bg-[#FF007F] hover:bg-[#e0006e] disabled:opacity-40 text-sm font-bold text-white rounded-lg transition-colors"
            >
              Crear
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-zinc-400 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ImpresionPage() {
  const [options, setOptions] = useState<PrintingOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/impresion')
      .then(r => r.json())
      .then(d => { setOptions(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group by technique for display
  const grouped = options.reduce<Record<string, PrintingOption[]>>((acc, o) => {
    acc[o.tecnica] = [...(acc[o.tecnica] ?? []), o];
    return acc;
  }, {});

  const handleSave = useCallback(async (updated: PrintingOption) => {
    await fetch('/api/admin/impresion', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setOptions(prev => prev.map(o => o.id === updated.id ? updated : o));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar esta opción?')) return;
    await fetch(`/api/admin/impresion?id=${id}`, { method: 'DELETE' });
    setOptions(prev => prev.filter(o => o.id !== id));
  }, []);

  const handleAdd = useCallback(async (newOpt: Omit<PrintingOption, 'id'>) => {
    const res = await fetch('/api/admin/impresion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOpt),
    });
    const created = await res.json() as PrintingOption;
    setOptions(prev => [...prev, created]);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Printer className="w-5 h-5 text-[#FF007F]" />
            <h1 className="text-xl font-black tracking-tight">Precios de Impresión</h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Define el costo por técnica y rango de cantidad. El cotizador usa estos precios automáticamente.
          </p>
        </div>

        {loading ? (
          <div className="text-zinc-500 font-mono text-sm animate-pulse">Cargando…</div>
        ) : options.length === 0 ? (
          <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
            <Printer className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm font-medium">Sin opciones de impresión aún</p>
            <p className="text-zinc-700 text-xs mt-1">Agrega tu primera técnica con el botón de abajo</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([tecnica, opts]) => (
              <div key={tecnica}>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">{tecnica}</p>
                <div className="space-y-2">
                  {opts.map(o => (
                    <OptionRow key={o.id} option={o} onSave={handleSave} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <NewOptionForm onAdd={handleAdd} />

        {options.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Resumen</p>
            <div className="space-y-1">
              {options.map(o => {
                const minPrice = Math.min(...o.tiers.map(t => t.precio));
                const maxPrice = Math.max(...o.tiers.map(t => t.precio));
                return (
                  <div key={o.id} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="text-zinc-600">{o.tecnica}</span>
                    <span className="text-zinc-700">·</span>
                    <span>{o.descripcion}</span>
                    <span className="ml-auto text-zinc-500">
                      ${fmt(minPrice)} – ${fmt(maxPrice)} /u
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
