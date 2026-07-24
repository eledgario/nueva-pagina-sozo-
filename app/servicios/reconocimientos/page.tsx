import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Reconocimientos & Premios | Sozo Corporate Labs',
  description: 'Medallas, trofeos, placas, diplomas y monedas conmemorativas personalizados. Para premiaciones, aniversarios y logros corporativos.',
};

const ACCENT = '#8b5cf6';

const items = [
  { icon: '🥇', title: 'Medallas Personalizadas', desc: 'Zinc, acero o aluminio. Relieve y esmalte de colores. Desde 1 pieza.' },
  { icon: '🏆', title: 'Trofeos Grabados', desc: 'Acrílico, cristal o madera con grabado láser. Diseño a tu medida.' },
  { icon: '🪪', title: 'Placas Corporativas', desc: 'Bronce, aluminio o acero cepillado. Para muro, escritorio o display.' },
  { icon: '📜', title: 'Diplomas & Reconocimientos', desc: 'Papel premium o enmarcado. Impresión digital o serigrafía.' },
  { icon: '🪙', title: 'Monedas Conmemorativas', desc: 'Challenge coins de zinc fundido. Emblema de empresa en relieve 3D.' },
  { icon: '💎', title: 'Artículos en Acrílico', desc: 'Corte y grabado láser de precisión. Transparente, espejo, de color.' },
];

export default function ReconocimientosPage() {
  return (
    <main className="pt-14">
      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-sm font-bold mb-4 block" style={{ color: ACCENT }}>
            [SERVICIO_05]
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            RECONOCIMIENTOS
            <br />
            <span style={{ color: ACCENT }}>&amp; PREMIOS</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Medallas, trofeos, placas y monedas que comunican el valor de un logro. Producción propia, sin intermediarios, desde una pieza hasta miles.
          </p>
          <a
            href="https://wa.me/5637929344?text=Hola!%20Quiero%20cotizar%20reconocimientos%20o%20premios%20corporativos"
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
              CADA LOGRO MERECE SU FORMA
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

      {/* Use Cases */}
      <section className="py-16 px-6 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-black text-zinc-900 mb-8 text-center">¿Para qué los usan nuestros clientes?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Empleado del Mes' },
              { label: 'Aniversarios de empresa' },
              { label: 'Torneos & Competencias' },
              { label: 'Certificaciones' },
              { label: 'Cierre de ventas' },
              { label: 'Graduaciones' },
              { label: 'Premios de Industria' },
              { label: 'Convenciones' },
            ].map(u => (
              <div key={u.label} className="px-4 py-3 bg-white border border-zinc-200 text-sm font-medium text-zinc-700">
                {u.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-zinc-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">¿Tienes una premiación próxima?</h2>
          <p className="text-zinc-400 mb-8">Cuéntanos el evento, la cantidad y el material que buscas. Te enviamos una propuesta en el día.</p>
          <a
            href="https://wa.me/5637929344?text=Hola!%20Necesito%20cotizar%20reconocimientos%20para%20una%20premiaci%C3%B3n.%20%C2%BFpueden%20ayudarme%3F"
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
