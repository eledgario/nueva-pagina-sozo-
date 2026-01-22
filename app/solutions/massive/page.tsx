import { Metadata } from 'next';
import SolutionHero from '@/components/solutions/SolutionHero';
import PreBuiltKits, { KitItem } from '@/components/solutions/PreBuiltKits';
import FilteredCatalog from '@/components/solutions/FilteredCatalog';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Eventos Masivos | Sozo Corporate Labs',
  description: 'Conferencias, expos y eventos corporativos de gran escala. Precios de mayoreo y logística para +500 unidades.',
  openGraph: {
    title: 'Eventos Masivos | Sozo',
    description: 'Merchandise para conferencias, expos y eventos de gran escala.',
  },
};

const ACCENT_COLOR = '#06b6d4';

const massiveKits: KitItem[] = [
  {
    id: 'attendee-basic',
    name: 'Attendee Basic',
    description: 'Kit estándar para asistentes',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800',
    contents: [
      '1x Lanyard con porta-gafete',
      '1x Tote bag serigrafía',
      '1x Libreta pequeña',
      '1x Pluma con logo',
      '1x Agenda del evento',
    ],
    priceRange: '$85 MXN',
    badge: '500+ uds',
    badgeColor: '#06b6d4',
    popular: true,
  },
  {
    id: 'speaker-pack',
    name: 'Speaker Pack',
    description: 'Kit especial para ponentes',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800',
    contents: [
      '1x Polo premium bordado',
      '1x Tumbler grabado',
      '1x Tech pouch con accesorios',
      '1x Credencial VIP',
      '1x Caja premium',
    ],
    priceRange: '$850 MXN',
    badge: 'VIP',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'sponsor-bundle',
    name: 'Sponsor Bundle',
    description: 'Paquete para stands de patrocinadores',
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=800',
    contents: [
      '100x Camisetas evento',
      '200x Vasos reutilizables',
      '500x Stickers die-cut',
      '50x Lanyards custom',
      'Diseño + Producción',
    ],
    priceRange: '$18,500 MXN',
    badge: 'Sponsors',
    badgeColor: '#f59e0b',
  },
];

// Volume pricing table
const volumePricing = [
  { quantity: '100-249', tshirt: '$145', tote: '$65', lanyard: '$35' },
  { quantity: '250-499', tshirt: '$125', tote: '$55', lanyard: '$28' },
  { quantity: '500-999', tshirt: '$105', tote: '$45', lanyard: '$22' },
  { quantity: '1,000+', tshirt: '$85', tote: '$35', lanyard: '$18' },
];

export default function MassivePage() {
  return (
    <main>
      <SolutionHero
        tag="Eventos Masivos"
        title="ESCALA"
        titleAccent="INDUSTRIAL"
        description="Conferencias, expos, hackathons y eventos corporativos. Producción de alto volumen con precios de mayoreo y logística incluida."
        imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"
        accentColor={ACCENT_COLOR}
        stats={[
          { value: '50+', label: 'MOQ Mínimo' },
          { value: '-40%', label: 'Precio Mayoreo' },
          { value: '48hrs', label: 'Express Disponible' },
        ]}
        ctaText="Cotizar Volumen"
        ctaHref="#pricing"
      />

      {/* Volume Pricing Table */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="font-mono text-sm font-bold mb-4 block"
              style={{ color: ACCENT_COLOR }}
            >
              [PRECIOS_MAYOREO]
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
              MIENTRAS MÁS, MEJOR
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
              Precios escalonados que premian el volumen. Todos incluyen personalización.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900 text-white">
                  <th className="px-6 py-4 text-left font-mono text-sm">Cantidad</th>
                  <th className="px-6 py-4 text-center font-mono text-sm">Camiseta</th>
                  <th className="px-6 py-4 text-center font-mono text-sm">Tote Bag</th>
                  <th className="px-6 py-4 text-center font-mono text-sm">Lanyard</th>
                </tr>
              </thead>
              <tbody>
                {volumePricing.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-zinc-200 ${
                      index === volumePricing.length - 1
                        ? 'bg-cyan-50'
                        : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-zinc-900">
                      {row.quantity}
                      {index === volumePricing.length - 1 && (
                        <span
                          className="ml-2 px-2 py-0.5 text-xs rounded-full text-white"
                          style={{ backgroundColor: ACCENT_COLOR }}
                        >
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-zinc-600">
                      {row.tshirt}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-zinc-600">
                      {row.tote}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-zinc-600">
                      {row.lanyard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-zinc-100 text-center">
              <p className="text-sm text-zinc-500">
                Precios en MXN + IVA. Incluye 1 color de serigrafía. Colores adicionales +$8/ud.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <a
              href="https://wa.me/5215512345678?text=Hola!%20Necesito%20cotizar%20un%20evento%20masivo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full transition-colors"
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              Solicitar Cotización por Volumen
            </a>
          </div>
        </div>
      </section>

      <section id="kits">
        <PreBuiltKits
          title="Paquetes para Eventos"
          subtitle="Soluciones probadas para diferentes tipos de asistentes y sponsors."
          kits={massiveKits}
          accentColor={ACCENT_COLOR}
        />
      </section>

      <FilteredCatalog
        title="Productos Event-Ready"
        subtitle="Alto volumen, bajo costo, máximo impacto."
        categories={['textil', 'drinkware', 'accessories']}
        accentColor={ACCENT_COLOR}
        maxItems={8}
      />

      {/* Logistics Section */}
      <section className="py-24 px-6 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-sm font-bold mb-4 block" style={{ color: ACCENT_COLOR }}>
              [LOGÍSTICA_EVENTOS]
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              LOGÍSTICA INCLUIDA
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              No solo producimos, entregamos directo en tu venue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '📦', title: 'Empaque por Tipo', desc: 'Separamos por talla, color o paquete' },
              { icon: '🚚', title: 'Entrega en Venue', desc: 'Coordinamos con tu equipo de logística' },
              { icon: '📋', title: 'Inventario', desc: 'Etiquetado y conteo verificado' },
              { icon: '🔄', title: 'Sobrante', desc: 'Recogemos y almacenamos el excedente' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
