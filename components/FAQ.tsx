'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'factura',
    question: '¿Emiten Factura Fiscal (SAT)?',
    answer: 'Sí, todos nuestros precios son + IVA y facturamos al momento de la compra. Somos una empresa 100% formal constituida en México.',
  },
  {
    id: 'moq',
    question: '¿Cuál es el pedido mínimo (MOQ)?',
    answer: 'Para Kits de Bienvenida: desde 12 unidades. Para eventos masivos (camisetas, gorras): desde 50 unidades. Para productos premium (tumblers, tech): desde 24 unidades.',
  },
  {
    id: 'envios',
    question: '¿Hacen envíos a todo México?',
    answer: 'Sí, cubrimos todo México con guías aseguradas. Envío Same-Day disponible en CDMX y área metropolitana. Envíos nacionales en 2-5 días hábiles.',
  },
  {
    id: 'muestras',
    question: '¿Puedo ver una muestra antes de comprar?',
    answer: 'Sí, puedes adquirir un "Sample Kit" genérico por $1,500 MXN que incluye ejemplos de nuestros productos más populares. Este monto es 100% reembolsable en tu primer pedido.',
  },
  {
    id: 'tiempos',
    question: '¿Cuánto tardan en producir mi pedido?',
    answer: 'Tiempos estándar: Serigrafía 5-7 días, Bordado 7-10 días, Láser/3D 3-5 días. Contamos con servicio EXPRESS con costo adicional para entregas urgentes.',
  },
  {
    id: 'diseno',
    question: '¿Incluyen el diseño o debo traer mis archivos?',
    answer: 'Ambas opciones. Si ya tienes tus archivos (AI, PDF, PNG alta resolución), los usamos directamente. Si necesitas ayuda, nuestro equipo de diseño puede crear mockups sin costo adicional.',
  },
  {
    id: 'almacenaje',
    question: '¿Cómo funciona el almacenaje?',
    answer: 'Una vez producido tu inventario, lo guardamos en nuestra bodega en CDMX sin costo por los primeros 90 días. Después, el almacenaje tiene un costo de $500 MXN/mes por pallet.',
  },
  {
    id: 'pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Transferencia bancaria (SPEI), tarjeta de crédito/débito (hasta 12 MSI), y para clientes recurrentes ofrecemos crédito a 30 días.',
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-zinc-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className={`font-bold text-lg pr-8 transition-colors ${isOpen ? 'text-[#FF007F]' : 'text-zinc-900 group-hover:text-[#FF007F]'}`}>
          {item.question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#FF007F] text-white' : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-600 leading-relaxed pr-16">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('moq');

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 lg:py-32 px-6 bg-zinc-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [PREGUNTAS_FRECUENTES]
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-zinc-900 tracking-tight">
            SIN RODEOS
          </h2>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Las preguntas que siempre nos hacen.{' '}
            <span className="text-zinc-900 font-semibold">Respuestas directas.</span>
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 md:p-10"
        >
          {faqItems.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-500 mb-4">
            ¿Tienes otra pregunta?
          </p>
          <a
            href="https://wa.me/5215512345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-[#FF007F] text-white font-bold text-sm uppercase tracking-wider rounded-full transition-colors"
          >
            Escríbenos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
