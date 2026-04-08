'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Category = 'todos' | 'textil' | 'promocional';

const filterTabs: { id: Category; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'textil', label: 'Textil' },
  { id: 'promocional', label: 'Promocional' },
];

const techniques = [
  'Serigrafía',
  'Tampografía',
  'Grabado Láser',
  'Sublimación',
  'DTF UV',
  'DTF Textil',
];

interface TextileProduct {
  type: 'textile';
  id: string;
  name: string;
  subtitle: string;
  specs: string[];
  imageUrl: string;
  colors: string;
}

interface PromoCategory {
  type: 'promo';
  id: string;
  name: string;
  imageUrl: string;
}

type Product = TextileProduct | PromoCategory;

const textiles: TextileProduct[] = [
  {
    type: 'textile',
    id: 'playera-4800',
    name: 'Playera Hombre',
    subtitle: 'Modelo 4800 — Heavy Weight',
    specs: ['100% Algodón', '165gr', '+40 colores'],
    imageUrl: 'https://www.moplayeras.com/cdn/shop/products/92058_MF-GRISGRAVA.jpg?v=1682361480',
    colors: '+40 colores',
  },
  {
    type: 'textile',
    id: 'playera-4810',
    name: 'Playera Mujer',
    subtitle: 'Modelo 4810 — Corte Femenino',
    specs: ['Heavy Weight', '165gr', 'Múltiples colores'],
    imageUrl: 'https://www.moplayeras.com/cdn/shop/products/92137_MF_57939673-5f69-4eeb-be6e-90c439bab38b_1024x1024.jpg?v=1682365769',
    colors: 'Múltiples colores',
  },
  {
    type: 'textile',
    id: 'sudadera-3320',
    name: 'Sudadera Unisex',
    subtitle: 'Modelo 3320 — Con Capucha',
    specs: ['Felpa interior', 'Máxima suavidad', 'Múltiples colores'],
    imageUrl: 'https://www.moplayeras.com/cdn/shop/products/91758_MF_9d73fa8b-4864-4180-986a-bbe04205de5f.jpg?v=1682109881',
    colors: 'Múltiples colores',
  },
];

const promoCategories: PromoCategory[] = [
  {
    type: 'promo',
    id: 'tazas',
    name: 'Tazas y Cilindros',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'boligrafos',
    name: 'Bolígrafos y Escritura',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'libretas',
    name: 'Libretas',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'mochilas',
    name: 'Mochilas y Maletas',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'llaveros',
    name: 'Llaveros',
    imageUrl: 'https://images.unsplash.com/photo-1582578598774-a377d4b32223?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'tecnologia',
    name: 'Tecnología',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'powerbanks',
    name: 'Power Banks',
    imageUrl: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'usb',
    name: 'Memorias USB',
    imageUrl: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'relojes',
    name: 'Relojes',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'paraguas',
    name: 'Paraguas',
    imageUrl: 'https://images.unsplash.com/photo-1534126874-5f6762db5e6c?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'fitness',
    name: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'ecologico',
    name: 'Línea Ecológica',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'ejecutivo',
    name: 'Línea Ejecutiva',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'hogar',
    name: 'Hogar y Oficina',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'viaje',
    name: 'Viaje',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop',
  },
  {
    type: 'promo',
    id: 'bar',
    name: 'Artículos de Bar',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
  },
];

function TextileCard({ product, index }: { product: TextileProduct; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="bg-white border-2 border-zinc-200 hover:border-[#FF007F] transition-all group overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={() => {}}
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-zinc-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
          Textil
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-black text-zinc-900 text-sm leading-tight">{product.name}</h3>
        <p className="font-mono text-[10px] text-[#FF007F] mt-0.5 mb-3">{product.subtitle}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-zinc-100 font-mono text-[9px] text-zinc-500 uppercase tracking-wide">
              {s}
            </span>
          ))}
        </div>
        <a
          href={`https://wa.me/525588060340?text=Hola! Me interesa el producto: ${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-900 hover:bg-[#FF007F] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

function PromoCard({ product, index }: { product: PromoCategory; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="bg-white border-2 border-zinc-200 hover:border-[#FF007F] transition-all group overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF007F] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
          Promo
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-black text-zinc-900 text-sm leading-tight">{product.name}</h3>
        <p className="font-mono text-[10px] text-zinc-400 mt-1 mb-3 uppercase tracking-wide">
          Personalizable con tu marca
        </p>
        <a
          href={`https://wa.me/525588060340?text=Hola! Me interesa el producto: ${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-900 hover:bg-[#FF007F] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

export default function ExpoCatalog() {
  const [active, setActive] = useState<Category>('todos');

  const textileItems = active === 'todos' || active === 'textil' ? textiles : [];
  const promoItems = active === 'todos' || active === 'promocional' ? promoCategories : [];
  const totalItems = textileItems.length + promoItems.length;

  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest">
            [CATÁLOGO_2026]
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-3 mb-4 text-zinc-900 tracking-tight">
            LO QUE HACEMOS
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Todos los productos se personalizan con el diseño y marca de tu empresa.
          </p>
        </motion.div>

        {/* Techniques strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {techniques.map((t) => (
            <span key={t} className="px-4 py-1.5 bg-zinc-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest">
              {t}
            </span>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                active === tab.id
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
              }`}
            >
              {tab.label}
              {tab.id !== 'todos' && (
                <span className="ml-2 opacity-50">
                  {tab.id === 'textil' ? textiles.length : promoCategories.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {totalItems > 0 ? (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {textileItems.map((p, i) => (
                <TextileCard key={p.id} product={p} index={i} />
              ))}
              {promoItems.map((p, i) => (
                <PromoCard key={p.id} product={p} index={textileItems.length + i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {/* Promo source note */}
        {(active === 'todos' || active === 'promocional') && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-mono text-[11px] text-zinc-400 mt-8"
          >
            Catálogo promocional completo disponible en{' '}
            <a href="https://innovation.com.mx/categoria/" target="_blank" rel="noopener noreferrer" className="text-[#FF007F] hover:underline">
              innovation.com.mx
            </a>
          </motion.p>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-zinc-500 font-mono text-sm mb-5">
            ¿No encuentras lo que buscas? Hacemos custom desde cero.
          </p>
          <a
            href="https://wa.me/525588060340"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-[#FF007F] text-white font-black text-sm uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Cotizar por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
