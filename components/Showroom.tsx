'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, MessageCircle, CalendarCheck } from 'lucide-react';

const HORARIOS = [
  { dia: 'Lunes — Viernes', horas: '10:00 am – 6:00 pm' },
  { dia: 'Sábado', horas: '10:00 am – 3:00 pm' },
  { dia: 'Domingo', horas: 'Cerrado' },
];

const razones = [
  { icon: '🖐️', texto: 'Toca y compara materiales antes de ordenar' },
  { icon: '🎨', texto: 'Ve las técnicas de impresión en vivo' },
  { icon: '📦', texto: 'Revisa muestras de empaque y acabados' },
  { icon: '🤝', texto: 'Habla directamente con un asesor' },
];

export default function Showroom() {
  return (
    <section className="py-24 px-6 bg-white border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest mb-3 block">
            [SHOWROOM_CDMX]
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none mb-4">
            VEN A VER
            <br />
            <span className="text-[#FF007F]">ANTES DE ORDENAR</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
            Tenemos muestras físicas de productos, materiales y técnicas de impresión. Visítanos y sal con tu cotización el mismo día.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Info */}
          <div className="space-y-4">

            {/* Dirección */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="border border-zinc-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#FF007F]" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Dirección</p>
                  <p className="font-black text-zinc-900 text-lg leading-tight">Próximamente</p>
                  <p className="text-zinc-500 text-sm mt-1">Ciudad de México</p>
                </div>
              </div>
            </motion.div>

            {/* Horarios */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="border border-zinc-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#FF007F]" />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-3">Horarios</p>
                  <div className="space-y-2">
                    {HORARIOS.map(h => (
                      <div key={h.dia} className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">{h.dia}</span>
                        <span className="font-mono text-sm font-bold text-zinc-900">{h.horas}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href="https://wa.me/5637929344?text=Hola!%20Quiero%20agendar%20una%20visita%20al%20showroom%20de%20Sozo."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900 hover:bg-[#FF007F] text-white font-bold text-sm uppercase tracking-wider transition-colors"
              >
                <CalendarCheck className="w-4 h-4" />
                Agendar Visita
              </a>
              <a
                href="https://wa.me/5637929344?text=Hola!%20Tengo%20una%20pregunta%20antes%20de%20visitarlos."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-bold text-sm uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Escribir Antes
              </a>
            </motion.div>
          </div>

          {/* Right — Por qué visitarnos */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-zinc-950 p-8 flex flex-col justify-between"
          >
            <div>
              <p className="font-mono text-[10px] text-[#FF007F] uppercase tracking-widest mb-6">
                ¿Por qué visitarnos?
              </p>
              <div className="space-y-5">
                {razones.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-2xl flex-shrink-0">{r.icon}</span>
                    <p className="text-white font-medium text-sm leading-snug">{r.texto}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="font-mono text-xs text-zinc-400">Atendemos en el momento, sin cita previa Lun–Vie</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
