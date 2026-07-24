import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Señalización & Displays | Sozo Corporate Labs',
  description: 'Banners, roll-ups, mamparas, lonas y stands. Producción rápida para eventos, expos y espacios corporativos.',
};

const ACCENT = '#FF007F';

const items = [
  { icon: '🎪', title: 'Banners Roll-Up', desc: 'Display retráctil 85×200 cm. Instalación en segundos, imagen de alto impacto.' },
  { icon: '🖼️', title: 'Lonas & Mamparas', desc: 'Impresión de gran formato en lona vinílica o tela stretch. Cualquier medida.' },
  { icon: '🏗️', title: 'Stands Pop-Up', desc: 'Estructura ligera con gráficos intercambiables. Ideal para expos y eventos.' },
  { icon: '🪧', title: 'Señalética Interior', desc: 'Carteles, señales de dirección, identificadores de área. Acrílico o PVC.' },
  { icon: '🖥️', title: 'Backdrops & Step&Repeat', desc: 'Fondo para fotografía o prensa. Tela de alta definición, sin brillos.' },
  { icon: '🏛️', title: 'Tótems & Floor Graphics', desc: 'Displays tridimensionales y gráficos de piso antideslizantes.' },
];

export default function SenalizacionPage() {
  return (
    <main className="pt-14">
      {/* Hero */}
      <section className="bg-zinc-950 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-sm font-bold mb-4 block" style={{ color: ACCENT }}>
            [SERVICIO_04]
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            SEÑALIZACIÓN
            <br />
            <span style={{ color: ACCENT }}>&amp; DISPLAYS</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Desde un banner roll-up para mañana hasta un stand completo para tu próxima expo. Producción rápida, impresión de alta calidad, entrega en CDMX.
          </p>
          <a
            href="https://wa.me/5637929344?text=Hola!%20Quiero%20cotizar%20se%C3%B1alizaci%C3%B3n%20para%20un%20evento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold uppercase tracking-wider transition-colors"
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
              TODO PARA TU ESPACIO
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

      {/* Stats */}
      <section className="py-16 px-6 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '24h', label: 'Entrega express CDMX' },
            { num: '3 días', label: 'Producción estándar' },
            { num: '1 ud', label: 'Sin mínimo de cantidad' },
            { num: '∞', label: 'Medidas personalizadas' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-zinc-900 mb-1" style={{ color: ACCENT }}>{s.num}</div>
              <div className="text-sm text-zinc-500 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-zinc-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">¿Tienes un evento próximo?</h2>
          <p className="text-zinc-400 mb-8">Mándanos las medidas y el diseño — o lo hacemos nosotros — y te cotizamos en menos de 2 horas.</p>
          <a
            href="https://wa.me/5637929344?text=Hola!%20Necesito%20cotizar%20se%C3%B1alizaci%C3%B3n%20y%20displays%20para%20un%20evento.%20%C2%BFme%20pueden%20ayudar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 font-bold uppercase tracking-wider transition-colors text-white"
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
