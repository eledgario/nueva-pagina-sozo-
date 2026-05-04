'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Instagram } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CatalogoCTA from '@/components/CatalogoCTA';

const features = [
  {
    num: '01',
    title: 'Diseño & Producción',
    desc: 'Serigrafía, bordado, grabado láser, impresión 3D. Técnicas híbridas para acabados que duran.',
  },
  {
    num: '02',
    title: 'Kits Corporativos',
    desc: 'Onboarding, eventos, gifting. Armamos, almacenamos y enviamos tus kits desde CDMX.',
  },
  {
    num: '03',
    title: 'Envíos On-Demand',
    desc: 'Contrata a alguien, avísanos. El kit llega a su casa. Same-day en CDMX, cobertura nacional.',
  },
];

export default function ExpoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 relative overflow-hidden">
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image
              src="/sozo-logo.png"
              alt="SOZO"
              width={160}
              height={52}
              className="h-14 w-auto object-contain brightness-0"
              priority
            />
          </div>

          {/* Badge */}
          <span className="inline-block font-mono text-xs font-bold text-[#FF007F] tracking-widest uppercase mb-6 border border-[#FF007F]/30 px-4 py-1.5 rounded-full">
            Hybrid Manufacturing Lab — CDMX
          </span>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 leading-none mb-8">
            MERCH QUE
            <br />
            <span className="text-[#FF007F]">IMPACTA.</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Producimos, almacenamos y enviamos tus kits corporativos.
            <br />
            <span className="text-zinc-900 font-semibold">Sin mínimos absurdos. Sin fricción.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/525588060340"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 hover:bg-[#FF007F] text-white font-black text-base uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Escríbenos por WhatsApp
            </a>
            <a
              href="mailto:ventas@sozo.com.mx"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-zinc-900 font-black text-base uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Mail className="w-5 h-5" />
              ventas@sozo.com.mx
            </a>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-0.5 h-8 bg-zinc-300"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest">
              [CÓMO_FUNCIONA]
            </span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 text-zinc-900 tracking-tight">
              TODO EN UNO
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative p-8 border-2 border-zinc-200 hover:border-[#FF007F] transition-colors group"
              >
                <div className="absolute -top-5 -left-5 w-10 h-10 bg-[#FF007F] flex items-center justify-center font-black text-white text-sm border-4 border-white shadow-md">
                  {f.num}
                </div>
                <h3 className="text-2xl font-black mb-3 text-zinc-900 group-hover:text-[#FF007F] transition-colors">
                  {f.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CatalogoCTA />

      {/* Contact CTA */}
      <section className="py-24 px-6 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              ¿LISTO PARA
              <br />
              <span className="text-[#FF007F]">TU KIT?</span>
            </h2>
            <p className="text-zinc-400 text-xl mb-10 max-w-xl mx-auto">
              Cuéntanos tu proyecto. Respuesta en menos de 24 hrs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="https://wa.me/525588060340"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#FF007F] hover:bg-white hover:text-zinc-900 text-white font-black text-base uppercase tracking-wider border-4 border-[#FF007F] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="mailto:ventas@sozo.com.mx"
                className="inline-flex items-center gap-3 px-10 py-5 bg-transparent hover:bg-white hover:text-zinc-900 text-white font-black text-base uppercase tracking-wider border-4 border-white transition-all"
              >
                <Mail className="w-5 h-5" />
                ventas@sozo.com.mx
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/sozo.cstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-zinc-800 hover:bg-[#FF007F] border border-zinc-700 flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500">
              <MapPin className="w-4 h-4 text-[#FF007F]" />
              <span className="font-mono text-sm">Ciudad de México, MX</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
