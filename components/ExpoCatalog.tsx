'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const techniques = [
  'Serigrafía',
  'Tampografía',
  'Grabado Láser',
  'Sublimación',
  'DTF UV',
  'DTF Textil',
];

interface CategoryDef {
  id: string;
  label: string;
  cover: string;
  pages: number[];
}

const categories: CategoryDef[] = [
  {
    id: 'bebidas',
    label: 'Bebidas',
    cover: '/catalogo/bebidas/product_page-004.jpg',
    pages: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
  },
  {
    id: 'belleza',
    label: 'Belleza',
    cover: '/catalogo/belleza/product_page-026.jpg',
    pages: [26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],
  },
  {
    id: 'ejecutiva',
    label: 'Línea Ejecutiva',
    cover: '/catalogo/ejecutiva/product_page-044.jpg',
    pages: [44,45,46,47,48,49,50,51],
  },
  {
    id: 'escritura',
    label: 'Escritura',
    cover: '/catalogo/escritura/product_page-052.jpg',
    pages: [52,53,54,55,56,57,58,59,60,61,62,63,64,65,66],
  },
  {
    id: 'hieleras',
    label: 'Hieleras',
    cover: '/catalogo/hieleras/product_page-067.jpg',
    pages: [67,68,69,70,71,72],
  },
  {
    id: 'hogar',
    label: 'Hogar',
    cover: '/catalogo/hogar/product_page-073.jpg',
    pages: [73,74,75,76,77,78,79,80,81,82,83,84,85],
  },
  {
    id: 'oficina',
    label: 'Oficina',
    cover: '/catalogo/oficina/product_page-086.jpg',
    pages: [86,87,88,89,90,91,92,93],
  },
  {
    id: 'mochilas',
    label: 'Mochilas',
    cover: '/catalogo/mochilas/product_page-094.jpg',
    pages: [94,95,96,97,98,99,100,101,102,103],
  },
  {
    id: 'tecnologia',
    label: 'Tecnología',
    cover: '/catalogo/tecnologia/product_page-104.jpg',
    pages: [104,105,106,107,108,109,110,111,112,113,114,115,116,117,118],
  },
  {
    id: 'viaje',
    label: 'Viaje',
    cover: '/catalogo/viaje/product_page-119.jpg',
    pages: [119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136],
  },
];

const textiles = [
  {
    id: 'playera-4800',
    label: 'Textil',
    name: 'Playera Hombre',
    subtitle: 'Modelo 4800 — Heavy Weight',
    specs: ['100% Algodón', '165gr', '+40 colores'],
    imageUrl: 'https://www.moplayeras.com/cdn/shop/products/92058_MF-GRISGRAVA.jpg?v=1682361480',
  },
  {
    id: 'playera-4810',
    label: 'Textil',
    name: 'Playera Mujer',
    subtitle: 'Modelo 4810 — Corte Femenino',
    specs: ['Heavy Weight', '165gr', 'Múltiples colores'],
    imageUrl: 'https://www.moplayeras.com/cdn/shop/products/92137_MF_57939673-5f69-4eeb-be6e-90c439bab38b_1024x1024.jpg?v=1682365769',
  },
  {
    id: 'sudadera-3320',
    label: 'Textil',
    name: 'Sudadera Unisex',
    subtitle: 'Modelo 3320 — Con Capucha',
    specs: ['Felpa interior', 'Máxima suavidad', 'Múltiples colores'],
    imageUrl: 'https://www.moplayeras.com/cdn/shop/products/91758_MF_9d73fa8b-4864-4180-986a-bbe04205de5f.jpg?v=1682109881',
  },
];

function CategoryCard({ cat, onClick }: { cat: CategoryDef; onClick: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative bg-white border-2 border-zinc-200 hover:border-[#FF007F] transition-all overflow-hidden text-left w-full"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={cat.cover}
          alt={cat.label}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-black text-sm leading-tight">{cat.label}</p>
          <p className="text-zinc-300 font-mono text-[10px] mt-0.5">{cat.pages.length} productos</p>
        </div>
      </div>
    </motion.button>
  );
}

function ProductImage({ src, alt, label }: { src: string; alt: string; label: string }) {
  const waMsg = `Hola! Me interesa este producto de ${label}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-white border-2 border-zinc-200 hover:border-[#FF007F] transition-all overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-3">
        <a
          href={`https://wa.me/525588060340?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-900 hover:bg-[#FF007F] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <MessageCircle className="w-3 h-3" />
          Cotizar
        </a>
      </div>
    </motion.div>
  );
}

export default function ExpoCatalog() {
  const [selected, setSelected] = useState<string | null>(null);

  const activeCat = categories.find((c) => c.id === selected);

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
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {techniques.map((t) => (
            <span key={t} className="px-4 py-1.5 bg-zinc-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest">
              {t}
            </span>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Category grid view */}
          {!selected && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Textil */}
              <p className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest mb-3">Textil</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {textiles.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white border-2 border-zinc-200 hover:border-[#FF007F] transition-all overflow-hidden"
                  >
                    <div className="relative aspect-square overflow-hidden bg-zinc-100">
                      <Image
                        src={t.imageUrl}
                        alt={t.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 20vw"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-zinc-900 text-white font-mono text-[9px] font-bold uppercase">
                        Textil
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-black text-zinc-900 text-xs leading-tight">{t.name}</p>
                      <p className="font-mono text-[9px] text-[#FF007F] mt-0.5 mb-2">{t.subtitle}</p>
                      <a
                        href={`https://wa.me/525588060340?text=Hola! Me interesa: ${encodeURIComponent(t.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 w-full py-1.5 bg-zinc-900 hover:bg-[#FF007F] text-white font-mono text-[9px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Cotizar
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Promocional */}
              <p className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest mb-3">Promocional — elige una categoría</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} cat={cat} onClick={() => setSelected(cat.id)} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Single category expanded */}
          {selected && activeCat && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Back button */}
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 mb-8 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-[#FF007F] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Todas las categorías
              </button>

              <div className="flex items-baseline gap-3 mb-8">
                <h3 className="text-3xl font-black text-zinc-900">{activeCat.label}</h3>
                <span className="font-mono text-sm text-zinc-400">{activeCat.pages.length} productos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {activeCat.pages.map((n) => {
                  const src = `/catalogo/${activeCat.id}/product_page-${String(n).padStart(3, '0')}.jpg`;
                  return (
                    <ProductImage
                      key={n}
                      src={src}
                      alt={`${activeCat.label} pág. ${n}`}
                      label={activeCat.label}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
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
            <MessageCircle className="w-4 h-4" />
            Cotizar por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
