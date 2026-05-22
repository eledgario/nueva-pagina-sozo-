'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Check, MessageCircle } from 'lucide-react';
import { useKitBuilder } from '@/context/KitBuilderContext';
import { useToast } from '@/components/kit-builder/Toast';

type Category = 'todos' | 'drinkware' | 'escritura' | 'ejecutiva' | 'tech' | 'mochilas' | 'hogar' | 'belleza';

interface Product {
  id: string;
  modelo: string;
  nombre: string;
  categoria: Category;
  imageUrl: string;
  desc: string;
}

const filterTabs: { id: Category; label: string }[] = [
  { id: 'todos',     label: 'Todos'      },
  { id: 'drinkware', label: 'Drinkware'  },
  { id: 'escritura', label: 'Escritura'  },
  { id: 'ejecutiva', label: 'Ejecutiva'  },
  { id: 'tech',      label: 'Tech'       },
  { id: 'mochilas',  label: 'Mochilas'   },
  { id: 'hogar',     label: 'Hogar'      },
  { id: 'belleza',   label: 'Belleza'    },
];

const WA = '525588060340';

const products: Product[] = [
  // Drinkware
  { id: 'te238', modelo: 'TE-238', nombre: 'Vaso Barete',          categoria: 'drinkware', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747900822968x120981413178805170/TE-238_03.jpg', desc: 'Acero inoxidable doble pared · Grabado láser' },
  { id: 'te240', modelo: 'TE-240', nombre: 'Vaso Pergole',         categoria: 'drinkware', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747900434802x613829082142993500/TE-240_02.jpg', desc: 'Acero inoxidable · Tapa con sello · Serigrafía' },
  { id: 'te247', modelo: 'TE-247', nombre: 'Vaso Milena',          categoria: 'drinkware', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747900838456x986216984109397200/TE-247_03.jpg', desc: 'Doble pared · Asas ergonómicas · Láser' },
  // Escritura
  { id: 'bl011', modelo: 'BL-011', nombre: 'Bolígrafo Praga',      categoria: 'escritura', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889748174x958718231294709800/BL-011_02.jpg', desc: 'Cuerpo metálico · Grabado láser · Premium' },
  { id: 'bl022', modelo: 'BL-022', nombre: 'Bolígrafo Vigo',       categoria: 'escritura', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889760578x100035872023655380/BL-022_07.jpg', desc: 'Plástico ABS · Tampografía · Múltiples colores' },
  { id: 'bl057', modelo: 'BL-057', nombre: 'Bolígrafo Andros',     categoria: 'escritura', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889561474x259629390652678980/BL-057_09.jpg', desc: 'Retráctil · Tinta negra · Ligero y funcional' },
  // Ejecutiva
  { id: 'st063', modelo: 'ST-063', nombre: 'Set Belitsa',          categoria: 'ejecutiva', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778189413515x131896192704845420/ST-063_02.jpg', desc: 'Set ejecutivo completo · Presentación premium' },
  { id: 'st058', modelo: 'ST-058', nombre: 'Set Ejecutivo Devin',  categoria: 'ejecutiva', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778017030936x247009838287304700/ST-058_02.jpg', desc: 'Set de lujo · Láser + tampografía' },
  { id: 'lb110', modelo: 'LB-110', nombre: 'Libreta Erimi',        categoria: 'ejecutiva', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1776970212376x672882803919316200/LB-110_02.jpg', desc: 'Pasta dura · Diseño ejecutivo · Grabado láser' },
  // Tech
  { id: 'th267', modelo: 'TH-267', nombre: 'Power Bank Ultra Slim',categoria: 'tech',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773158282714x196271180865279700/TH-267_02.jpg', desc: 'Carga rápida · Compacto · Personalizable' },
  { id: 'th272', modelo: 'TH-272', nombre: 'Bocina Opole',         categoria: 'tech',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773073056788x656601407991168600/TH-272_02.jpg', desc: 'Bluetooth · Portátil · Tampografía' },
  { id: 'th268', modelo: 'TH-268', nombre: 'Audífonos Bytom',      categoria: 'tech',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1772836601487x567090319905139100/TH-268_02.jpg', desc: 'Inalámbricos TWS · Estuche personalizable' },
  // Mochilas
  { id: 'tx394', modelo: 'TX-394', nombre: 'Mochila Engomi',       categoria: 'mochilas',  imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778020406984x307413490126253060/TX-394_02.jpg', desc: 'Plegable · Resistente · Serigrafía' },
  { id: 'tx395', modelo: 'TX-395', nombre: 'Bagpack Legnica',      categoria: 'mochilas',  imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773076096607x665235266830753300/TX-395_02.jpg', desc: 'Compartimento laptop · Resistente al agua' },
  { id: 'tx402', modelo: 'TX-402', nombre: 'Mochila Leszno',       categoria: 'mochilas',  imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1771254538314x229027982964813200/TX-402_02.jpg', desc: 'Ejecutiva · Múltiples compartimentos' },
  // Hogar
  { id: 'hm158', modelo: 'HM-158', nombre: 'Mini Tabla Salzach',   categoria: 'hogar',     imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747901073305x124567883909376700/HM-158_03.jpg', desc: 'Madera natural · Grabado láser · Con accesorios' },
  { id: 'hm155', modelo: 'HM-155', nombre: 'Set Corbeil',          categoria: 'hogar',     imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747901190273x839789660090816800/HM-155_05.jpg', desc: 'Set de cocina premium · Grabado láser' },
  { id: 'hm149', modelo: 'HM-149', nombre: 'Porta Vasos Frazé',    categoria: 'hogar',     imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747901340660x140011128801512450/HM-149_03.jpg', desc: 'Juego porta vasos · Madera · Láser' },
  // Belleza
  { id: 'be018', modelo: 'BE-018', nombre: 'Espejo Rectangular',   categoria: 'belleza',   imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889692039x901247230555155300/BE-018_04.jpg', desc: 'Doble vista · Compacto · Tampografía' },
  { id: 'be022', modelo: 'BE-022', nombre: 'Espejo Blarney',       categoria: 'belleza',   imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889709036x982914059701036700/BE-022_03.jpg', desc: 'ABS rubber · Doble cara · Portátil' },
];

function buildWAUrl(p: Product): string {
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Hola SOZO! Me interesa cotizar: ${p.nombre} (${p.modelo})`)}`;
}

function ProductCard({ product, index, onAddToKit }: {
  product: Product; index: number; onAddToKit: (p: Product) => void;
}) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToKit(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.nombre}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <motion.button
          onClick={handleAdd}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all border ${
            justAdded
              ? 'bg-green-500 border-green-500 opacity-100'
              : 'bg-white border-zinc-200 opacity-0 group-hover:opacity-100 hover:bg-[#FF007F] hover:text-white hover:border-[#FF007F]'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {justAdded ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
        </motion.button>
        <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-zinc-900 text-base leading-tight">{product.nombre}</h3>
          <span className="font-mono text-[10px] text-zinc-400 flex-shrink-0 mt-0.5">{product.modelo}</span>
        </div>
        <p className="text-zinc-500 text-xs mb-4 leading-relaxed">{product.desc}</p>

        <div className="flex gap-2">
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              justAdded ? 'bg-green-500 text-white' : 'bg-zinc-900 hover:bg-[#FF007F] text-white'
            }`}
          >
            {justAdded ? <><Check className="w-3.5 h-3.5" />Agregado</> : <><Plus className="w-3.5 h-3.5" />Al kit</>}
          </motion.button>
          <a
            href={buildWAUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function TheArsenal() {
  const [activeFilter, setActiveFilter] = useState<Category>('todos');
  const { addItem } = useKitBuilder();
  const { showToast } = useToast();

  const filtered = activeFilter === 'todos'
    ? products
    : products.filter((p) => p.categoria === activeFilter);

  const handleAddToKit = (p: Product) => {
    addItem({ id: p.id, name: p.nombre, imageUrl: p.imageUrl, price: '', category: p.categoria });
    showToast(`${p.nombre} agregado al kit`, 'success');
  };

  return (
    <section className="py-24 lg:py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [CATÁLOGO_DESTACADO]
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
            EL ARSENAL
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Productos reales, listos para personalizarse con tu marca.{' '}
            <span className="text-zinc-900 font-semibold">Agrega al kit o cotiza directo.</span>
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12 overflow-x-auto pb-2"
        >
          <div className="inline-flex items-center gap-1 p-1.5 bg-zinc-100 rounded-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-full whitespace-nowrap ${
                  activeFilter === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {activeFilter === tab.id && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-zinc-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onAddToKit={handleAddToKit} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <p className="text-zinc-500 font-mono text-sm">
              +1,300 productos disponibles en el catálogo completo
            </p>
            <a
              href="/catalogo"
              className="px-6 py-3 bg-[#FF007F] hover:bg-zinc-900 text-white font-bold text-sm uppercase tracking-wider rounded-full transition-colors"
            >
              Ver catálogo completo
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
