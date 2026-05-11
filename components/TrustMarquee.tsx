'use client';

import { motion } from 'framer-motion';

const categories = [
  { label: 'Bebidas & Termos', count: '1,334' },
  { label: 'Mochilas & Bolsas', count: '909' },
  { label: 'Tecnología', count: '519' },
  { label: 'Escritura', count: '1,227' },
  { label: 'Kits Ejecutivos', count: '178' },
  { label: 'Hieleras', count: '305' },
  { label: 'Hogar', count: '293' },
  { label: 'Textiles', count: '309' },
  { label: 'Belleza', count: '151' },
  { label: 'Varios', count: '1,405' },
];

export default function TrustMarquee() {
  const doubled = [...categories, ...categories];

  return (
    <section className="py-10 bg-zinc-50 border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-5">
        <p className="text-center text-xs font-mono text-zinc-400 uppercase tracking-widest">
          +6,700 productos en 10 categorías — todos personalizables
        </p>
      </div>

      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <motion.div
          className="flex items-center gap-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((cat, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-6 px-8 py-3 border-r border-zinc-200"
            >
              <div>
                <p className="font-black text-sm text-zinc-900 whitespace-nowrap">{cat.label}</p>
                <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">{cat.count} productos</p>
              </div>
              <span className="w-1.5 h-1.5 bg-[#FF007F] rounded-full flex-shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
