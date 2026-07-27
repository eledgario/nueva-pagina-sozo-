'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ShoppingBag, ChevronRight,
  RotateCcw, MessageCircle, Check,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Producto {
  id: string;
  nombre: string;
  modelo: string;
  desc: string;
  categoria: string;
  imagenes?: string[];
}

interface Category {
  id: string;
  nombre: string;
  count: number;
}

// ─── Product card ─────────────────────────────────────────────────────────────

function KioskoCard({
  product, selected, onToggle,
}: { product: Producto; selected: boolean; onToggle: () => void }) {
  const [imgError, setImgError] = useState(false);
  const img = product.imagenes?.[0];

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.96 }}
      className={`relative aspect-[3/4] w-full overflow-hidden transition-all duration-200 ${
        selected ? 'ring-4 ring-[#FF007F] ring-offset-2 ring-offset-zinc-950' : ''
      }`}
    >
      {img && !imgError ? (
        <Image
          src={img} alt={product.nombre} fill unoptimized
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <span className="font-mono text-zinc-500 font-black text-lg">{product.modelo}</span>
        </div>
      )}

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Selected check */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-3 right-3 w-9 h-9 bg-[#FF007F] rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modelo badge */}
      <div className="absolute top-3 left-3">
        <span className="font-mono text-[10px] bg-black/60 text-zinc-300 px-2 py-0.5 backdrop-blur-sm">
          {product.modelo}
        </span>
      </div>

      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-bold text-sm leading-tight line-clamp-2">{product.nombre}</p>
        <p className="text-zinc-400 text-xs font-mono mt-0.5 capitalize">{product.categoria}</p>
      </div>
    </motion.button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 18;

export default function KioskoPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Producto[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch categories once
  useEffect(() => {
    fetch('/api/products?meta=1')
      .then(r => r.json())
      .then(data => {
        setCategories([
          { id: 'todos', nombre: 'Todos', count: data.total },
          ...data.categorias,
        ]);
      });
  }, []);

  // Fetch products when category/search/page changes
  const fetchProducts = useCallback(async (
    cat: string, q: string, p: number, replace: boolean,
  ) => {
    setLoading(true);
    const params = new URLSearchParams({
      category: cat,
      page: String(p),
      pageSize: String(PAGE_SIZE),
    });
    if (q) params.set('search', q);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(prev => replace ? data.products : [...prev, ...data.products]);
    setTotal(data.total);
    setLoading(false);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(activeCategory, debouncedSearch, 1, true);
  }, [activeCategory, debouncedSearch, fetchProducts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProducts(activeCategory, debouncedSearch, next, false);
  };

  const toggleProduct = (p: Producto) => {
    setSelected(prev =>
      prev.find(s => s.id === p.id)
        ? prev.filter(s => s.id !== p.id)
        : [...prev, p],
    );
  };

  const reset = () => {
    setSelected([]);
    setShowSelection(false);
    setCustomerPhone('');
    setSearch('');
    setActiveCategory('todos');
  };

  const buildWhatsApp = (toAdvisor = false) => {
    const phone = toAdvisor
      ? '5637929344'
      : (customerPhone.replace(/\D/g, '') || '5637929344');
    const list = selected.map(p => `  • ${p.nombre} (${p.modelo})`).join('\n');
    const msg = toAdvisor
      ? `Cliente en tienda interesado en:\n\n${list}`
      : `Hola! Vi estos productos en el showroom de Sozo y me interesan:\n\n${list}\n\n¿Me pueden dar información y precios?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const hasMore = products.length < total;

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden select-none">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-[#FF007F] flex items-center justify-center">
            <span className="text-white font-black text-xs tracking-widest">SZ</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-white font-black text-sm tracking-widest uppercase">SOZO</p>
            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest">Catálogo interactivo</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar producto o código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-800 text-white placeholder-zinc-500 pl-10 pr-10 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF007F] font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-zinc-300" />
            </button>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors rounded-xl flex-shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>

      {/* ── Category bar ── */}
      <div className="flex gap-2 px-5 py-3 bg-zinc-900 border-b border-zinc-800 overflow-x-auto flex-shrink-0 scrollbar-hide">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full ${
              activeCategory === c.id
                ? 'bg-[#FF007F] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {/* ── Product grid ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map(p => (
            <KioskoCard
              key={p.id}
              product={p}
              selected={!!selected.find(s => s.id === p.id)}
              onToggle={() => toggleProduct(p)}
            />
          ))}
        </div>

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center py-6">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-wider transition-colors rounded-xl"
            >
              Ver más productos ({total - products.length} restantes)
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#FF007F] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <Search className="w-12 h-12 mb-4" />
            <p className="font-bold text-lg">Sin resultados</p>
            <p className="text-sm font-mono mt-1">Intenta con otro término</p>
          </div>
        )}
      </div>

      {/* ── Bottom selection bar ── */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="flex items-center justify-between px-5 py-4 bg-zinc-900 border-t border-zinc-800 flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 bg-[#FF007F] rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full text-[#FF007F] font-black text-[10px] flex items-center justify-center">
                  {selected.length}
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {selected.length} {selected.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </p>
                <p className="text-zinc-500 text-xs font-mono">Sigue explorando o toca para ver tu lista</p>
              </div>
            </div>
            <button
              onClick={() => setShowSelection(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#FF007F] hover:bg-[#e0006f] text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-xl"
            >
              Ver selección
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Selection modal ── */}
      <AnimatePresence>
        {showSelection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSelection(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-6 bg-zinc-900 border border-zinc-700 z-50 rounded-2xl flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
                <div>
                  <h2 className="text-white font-black text-2xl">Tu selección</h2>
                  <p className="text-zinc-500 text-sm font-mono mt-0.5">
                    {selected.length} {selected.length === 1 ? 'producto' : 'productos'} · Toca ✕ para quitar
                  </p>
                </div>
                <button
                  onClick={() => setShowSelection(false)}
                  className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Selected products grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {selected.map(p => (
                    <div key={p.id} className="relative bg-zinc-800 rounded-xl overflow-hidden">
                      <div className="aspect-[3/4] relative">
                        {p.imagenes?.[0] ? (
                          <Image
                            src={p.imagenes[0]} alt={p.nombre} fill unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-zinc-700 flex items-center justify-center">
                            <span className="font-mono text-zinc-400 font-black">{p.modelo}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white font-bold text-xs leading-tight line-clamp-2">{p.nombre}</p>
                          <p className="text-zinc-400 font-mono text-[10px] mt-0.5">{p.modelo}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleProduct(p)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Phone input */}
                <div className="bg-zinc-800 rounded-xl p-5">
                  <p className="text-white font-bold text-sm mb-1">Enviar lista a tu WhatsApp</p>
                  <p className="text-zinc-500 text-xs font-mono mb-3">Opcional — te llegará la lista para dar seguimiento</p>
                  <input
                    type="tel"
                    placeholder="Tu número (ej. 5512345678)"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] font-mono placeholder-zinc-500"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-zinc-800 flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={buildWhatsApp(false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar a mi WhatsApp
                </a>
                <a
                  href={buildWhatsApp(true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Notificar al asesor
                </a>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nueva búsqueda
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
