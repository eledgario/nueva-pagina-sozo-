'use client';

import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CatalogoCTA() {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest">
            [CATÁLOGO_2026]
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-3 mb-5 text-zinc-900 tracking-tight">
            MÁS DE 130
            <br />
            <span className="text-[#FF007F]">PRODUCTOS.</span>
          </h2>
          <p className="text-zinc-500 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Bebidas, tecnología, mochilas, escritura, hogar y más.
            Todos personalizables con tu marca.
          </p>

          <Link
            href="/registro"
            className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 hover:bg-[#FF007F] text-white font-black text-base uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Pedir catálogo completo
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-zinc-400 font-mono text-xs mt-5 uppercase tracking-widest">
            Te lo enviamos directo a tu correo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
