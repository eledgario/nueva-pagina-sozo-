import { Metadata } from 'next';
import PortfolioHero from '@/components/solutions/PortfolioHero';
import PreBuiltKits, { KitItem } from '@/components/solutions/PreBuiltKits';
import FilteredCatalog from '@/components/solutions/FilteredCatalog';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Teams & Onboarding | Sozo Corporate Labs',
  description: 'Kits de bienvenida y cultura corporativa. Equipa a tu equipo desde el día uno con merchandise premium personalizado.',
  openGraph: {
    title: 'Teams & Onboarding | Sozo',
    description: 'Kits de bienvenida y cultura corporativa para startups y empresas.',
  },
};

const ACCENT_COLOR = '#FF007F';

const teamsKits: KitItem[] = [
  {
    id: 'rookie-kit',
    name: 'The Rookie',
    description: 'Kit de entrada para nuevos empleados',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
    contents: [
      '1x Camiseta básica bordada',
      '1x Taza cerámica con logo',
      '1x Libreta y pluma',
      '1x Sticker pack',
      '1x Caja kraft personalizada',
    ],
    priceRange: '$650 MXN',
    badge: 'Entry Level',
    badgeColor: '#06b6d4',
  },
  {
    id: 'pro-kit',
    name: 'The Pro',
    description: 'Kit premium para roles clave',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800',
    contents: [
      '1x Hoodie premium bordado',
      '1x Tumbler acero inoxidable',
      '1x Libreta piel sintética',
      '1x Power bank grabado',
      '1x Caja rígida con foam',
    ],
    priceRange: '$1,450 MXN',
    popular: true,
  },
  {
    id: 'executive-kit',
    name: 'The Executive',
    description: 'Kit de lujo para C-Level',
    imageUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800',
    contents: [
      '1x Chamarra premium bordada',
      '1x Tumbler edición especial',
      '1x Set ejecutivo (libreta + pluma)',
      '1x Tech bundle (cargador + stand)',
      '1x Caja madera con grabado',
    ],
    priceRange: '$2,800 MXN',
    badge: 'C-Level',
    badgeColor: '#8b5cf6',
  },
];

export default function TeamsPage() {
  return (
    <main>
      <PortfolioHero
        category="Teams & Onboarding"
        title="EQUIPA A TU
EQUIPO"
        subtitle="Desde el primer día hasta cada aniversario. Kits de bienvenida que construyen cultura y hacen que cada empleado se sienta parte desde el inicio."
        images={[
          'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200',
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200',
          'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200',
          'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1200',
        ]}
        accentColor={ACCENT_COLOR}
        moq={12}
        leadTime="5-7 días"
        ctaText="Armar Kit"
        ctaHref="#kits"
      />

      <section id="kits">
        <PreBuiltKits
          title="Kits de Onboarding"
          subtitle="Soluciones pre-armadas para cada nivel de tu organización. Personaliza colores y agrega tu logo."
          kits={teamsKits}
          accentColor={ACCENT_COLOR}
        />
      </section>

      <FilteredCatalog
        title="Productos Recomendados"
        subtitle="Los favoritos de nuestros clientes corporativos para equipar equipos."
        categories={['textil', 'drinkware', 'tech', 'accessories']}
        accentColor={ACCENT_COLOR}
        maxItems={8}
      />

      {/* Value Props Section */}
      <section className="py-24 px-6 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
              [POR_QUE_SOZO]
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              MÁS QUE UN KIT
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Infraestructura completa para tu programa de onboarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Almacenaje Incluido',
                description: '90 días gratis en nuestra bodega CDMX. Después $500/mes por pallet.',
                icon: '📦',
              },
              {
                title: 'Envíos On-Demand',
                description: 'Contrata a alguien nuevo? Enviamos el kit a su casa en 24hrs.',
                icon: '🚀',
              },
              {
                title: 'Dashboard de Inventario',
                description: 'Monitorea tu stock en tiempo real. Alertas de reorden automáticas.',
                icon: '📊',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
