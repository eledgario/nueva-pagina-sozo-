import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Material Impreso | Sozo Corporate Labs',
  description: 'Tarjetas de presentación, flyers, carpetas, papelería corporativa y etiquetas. Impresión offset y digital de alta calidad.',
};

const ACCENT = '#06b6d4';

const items = [
  { icon: '💳', title: 'Tarjetas de Presentación', desc: 'Offset o digital, con o sin barniz UV. Papel de 300-450 gr. Acabados especiales.' },
  { icon: '📄', title: 'Flyers & Dípticos', desc: 'Impresión a full color, papel couché brillante o mate. Tirajes desde 100 uds.' },
  { icon: '📂', title: 'Carpetas Corporativas', desc: 'Con bolsillo interior, troquelado para tarjeta, lomo. Imagen institucional.' },
  { icon: '🗒️', title: 'Papelería con Logo', desc: 'Hojas membretadas, sobres, blocks, facturas. Tu identidad en cada papel.' },
  { icon: '🏷️', title: 'Etiquetas & Stickers', desc: 'Troquelados en cualquier forma. Papel, BOPP transparente o metálico.' },
  { icon: '📋', title: 'Menús & Catálogos', desc: 'Impresión de catálogos de productos, menús de restaurante y revistas.' },
];

export default function ImpresionPage() {
  return (
    <main className="pt-14">
      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-sm font-bold mb-4 block" style={{ color: ACCENT }}>
            [SERVICIO_06]
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            MATERIAL
            <br />
            <span style={{ color: ACCENT }}>IMPRESO</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Tarjetas, flyers, carpetas y papelería corporativa. Impresión offset y digital de alta resolución. Todo lo que tu empresa necesita para presentarse bien en papel.
          </p>
          <a
            href="https://wa.me/5637929344?text=Hola!%20Quiero%20cotizar%20material%20impreso%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Cotizar Ahora →
          </a>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="font-mono text-sm font-bold mb-2 block" style={{ color: ACCENT }}>
              [LO_QUE_HACEMOS]
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900">
              PRESENCIA EN CADA PAPEL
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.title} className="border border-zinc-200 p-8 hover:border-zinc-900 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-black text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acabados */}
      <section className="py-16 px-6 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-black text-zinc-900 mb-8 text-center">Acabados disponibles</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Barniz UV Total', 'Barniz UV Localizado', 'Laminado Mate', 'Laminado Brillante',
              'Soft Touch', 'Stamping Dorado', 'Stamping Plateado', 'Relieve Seco', 'Troquelado Especial',
            ].map(a => (
              <span key={a} className="px-4 py-2 bg-white border border-zinc-200 text-sm font-medium text-zinc-700 font-mono">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-zinc-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">¿Necesitas material impreso urgente?</h2>
          <p className="text-zinc-400 mb-8">Comparte tu diseño o brief con nosotros y te enviamos cotización y tiempos de entrega en menos de 2 horas.</p>
          <a
            href="https://wa.me/5637929344?text=Hola!%20Necesito%20cotizar%20material%20impreso%20para%20mi%20empresa.%20%C2%BFpueden%20ayudarme%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: ACCENT }}
          >
            Hablar con un Asesor
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
