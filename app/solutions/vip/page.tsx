import { Metadata } from 'next';
import PortfolioHero from '@/components/solutions/PortfolioHero';
import PreBuiltKits, { KitItem } from '@/components/solutions/PreBuiltKits';
import FilteredCatalog from '@/components/solutions/FilteredCatalog';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Client Gifting & VIP | Sozo Corporate Labs',
  description: 'Regalos ejecutivos de alto impacto. Cierra tratos y fortalece relaciones con merchandise premium personalizado.',
  openGraph: {
    title: 'Client Gifting & VIP | Sozo',
    description: 'Regalos ejecutivos premium para clientes y socios estratégicos.',
  },
};

const ACCENT_COLOR = '#8b5cf6';

const vipKits: KitItem[] = [
  {
    id: 'thank-you-box',
    name: 'Thank You Box',
    description: 'Agradecimiento a clientes clave',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
    contents: [
      '1x Producto gourmet local',
      '1x Vela aromática premium',
      '1x Tarjeta personalizada',
      '1x Caja rígida con lazo',
    ],
    priceRange: '$650 MXN',
    badge: 'Appreciation',
    badgeColor: '#ec4899',
  },
  {
    id: 'closer-box',
    name: 'The Closer',
    description: 'Para cerrar tratos importantes',
    imageUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800',
    contents: [
      '1x Tumbler premium grabado',
      '1x Set ejecutivo (libreta + pluma)',
      '1x Botella de vino/mezcal',
      '1x Carta manuscrita',
      '1x Caja madera con grabado',
    ],
    priceRange: '$1,800 MXN',
    popular: true,
  },
  {
    id: 'founders-edition',
    name: "Founder's Edition",
    description: 'Ultra-premium para VVIPs',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800',
    contents: [
      '1x Chamarra o prenda premium',
      '1x Tech bundle completo',
      '1x Experiencia (cena, spa, etc)',
      '1x Producto artesanal mexicano',
      '1x Caja coleccionista',
    ],
    priceRange: '$4,500 MXN',
    badge: 'Ultra Premium',
    badgeColor: '#8b5cf6',
  },
];

// Use cases
const useCases = [
  {
    title: 'Cierre de Ventas',
    description: 'Regalo que llega justo después de firmar. Refuerza la decisión.',
    icon: '🤝',
  },
  {
    title: 'Retención de Clientes',
    description: 'Aniversarios de contrato, renovaciones, hitos alcanzados.',
    icon: '🔄',
  },
  {
    title: 'Referidos',
    description: 'Agradece a quienes te recomiendan con algo memorable.',
    icon: '💎',
  },
  {
    title: 'Navidad Corporativa',
    description: 'Fin de año sin el estrés. Nosotros enviamos a todos tus clientes.',
    icon: '🎄',
  },
];

export default function VIPPage() {
  return (
    <main>
      <PortfolioHero
        category="Client Gifting"
        title="CIERRA
TRATOS"
        subtitle="Regalos ejecutivos que abren puertas y fortalecen relaciones. Porque un buen regalo dice más que mil correos de seguimiento."
        images={[
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200',
          'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1200',
          'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200',
          'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1200',
        ]}
        accentColor={ACCENT_COLOR}
        moq={5}
        leadTime="48hrs express"
        ctaText="Crear Regalo VIP"
        ctaHref="#kits"
      />

      {/* Use Cases */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="font-mono text-sm font-bold mb-4 block"
              style={{ color: ACCENT_COLOR }}
            >
              [CASOS_DE_USO]
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
              MOMENTOS QUE IMPORTAN
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
              Un regalo en el momento correcto vale más que diez en el momento equivocado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-zinc-100"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-zinc-500 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kits">
        <PreBuiltKits
          title="Regalos Ejecutivos"
          subtitle="Paquetes curados para diferentes ocasiones y presupuestos."
          kits={vipKits}
          accentColor={ACCENT_COLOR}
        />
      </section>

      <FilteredCatalog
        title="Productos Premium"
        subtitle="Solo lo mejor para tus clientes más importantes."
        categories={['premium', 'tech', 'drinkware', 'accessories']}
        accentColor={ACCENT_COLOR}
        maxItems={8}
      />

      {/* Concierge Service */}
      <section className="py-24 px-6 bg-zinc-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-sm font-bold mb-4 block" style={{ color: ACCENT_COLOR }}>
            [SERVICIO_CONCIERGE]
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            NOSOTROS NOS
            <br />
            <span style={{ color: ACCENT_COLOR }}>ENCARGAMOS</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Danos tu lista de clientes y nosotros hacemos el resto: diseño,
            producción, empaque, tarjetas personalizadas y envío individual a cada
            destinatario.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: '01',
                title: 'Lista de Clientes',
                desc: 'Comparte tu Excel con nombres, direcciones y notas personales.',
              },
              {
                step: '02',
                title: 'Diseño & Producción',
                desc: 'Creamos el regalo y las tarjetas personalizadas.',
              },
              {
                step: '03',
                title: 'Envío Individual',
                desc: 'Cada regalo llega empacado y con tracking.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-2xl font-black text-white"
                  style={{ backgroundColor: ACCENT_COLOR }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/5215512345678?text=Hola!%20Quiero%20información%20del%20servicio%20concierge%20para%20client%20gifting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full transition-colors"
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            Activar Servicio Concierge
          </a>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">⭐</div>
          <blockquote className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6 leading-relaxed">
            &ldquo;Enviamos Closer Boxes a 50 prospectos. Cerramos 12 deals ese
            trimestre. ROI absurdo.&rdquo;
          </blockquote>
          <cite className="text-zinc-500 not-italic">
            — Director Comercial, Fintech Series A
          </cite>
        </div>
      </section>

      <Footer />
    </main>
  );
}
