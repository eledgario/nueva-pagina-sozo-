import { Metadata } from 'next';
import SolutionHero from '@/components/solutions/SolutionHero';
import PreBuiltKits, { KitItem } from '@/components/solutions/PreBuiltKits';
import FilteredCatalog from '@/components/solutions/FilteredCatalog';
import Footer from '@/components/Footer';
import { Palette, Sparkles, Heart, Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Eventos Sociales | Sozo Corporate Labs',
  description: 'Bodas, XV años, fiestas y eventos especiales. Diseño de autor y producción premium para tus momentos únicos.',
  openGraph: {
    title: 'Eventos Sociales | Sozo',
    description: 'Merchandise personalizado para bodas, fiestas y eventos especiales.',
  },
};

const ACCENT_COLOR = '#f59e0b';

const socialKits: KitItem[] = [
  {
    id: 'hangover-kit',
    name: 'Hangover Kit',
    description: 'Para la mañana después de la fiesta',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800',
    contents: [
      '1x Bolsa de tela personalizada',
      '2x Botellas de agua',
      '1x Snack pack',
      '1x Aspirina + vitaminas',
      '1x Tarjeta de agradecimiento',
    ],
    priceRange: '$180 MXN',
    badge: 'Fan Favorite',
    badgeColor: '#f59e0b',
    popular: true,
  },
  {
    id: 'wedding-guest',
    name: 'Wedding Guest',
    description: 'Kit de bienvenida para invitados',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    contents: [
      '1x Tote bag con diseño nupcial',
      '1x Abanico personalizado',
      '1x Programa del evento',
      '1x Snack artesanal local',
      '1x Caja kraft con ribbon',
    ],
    priceRange: '$350 MXN',
    badge: 'Bodas',
    badgeColor: '#ec4899',
  },
  {
    id: 'party-pack',
    name: 'Party Pack',
    description: 'Recuerdos memorables para fiestas',
    imageUrl: 'https://images.unsplash.com/photo-1496843916299-590492c751f4?q=80&w=800',
    contents: [
      '1x Camiseta evento',
      '1x Vaso reutilizable',
      '1x Pulsera de tela',
      '1x Props para fotos',
      '1x Bolsa de regalo',
    ],
    priceRange: '$280 MXN',
    badge: 'Fiestas',
    badgeColor: '#8b5cf6',
  },
];

// Client component for animated section
function DesignServicesSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ backgroundColor: `${ACCENT_COLOR}20`, color: ACCENT_COLOR }}
            >
              Design Studio
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">
              DISEÑO DE
              <br />
              <span style={{ color: ACCENT_COLOR }}>AUTOR</span>
            </h2>

            <p className="text-xl text-zinc-500 mb-8 leading-relaxed">
              No tienes diseñador? Nuestro equipo creativo desarrolla toda la
              identidad visual de tu evento: invitaciones, señalética, merchandise
              y más. Todo cohesivo, todo memorable.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Palette, text: 'Paleta de colores' },
                { icon: Sparkles, text: 'Tipografía custom' },
                { icon: Heart, text: 'Monogramas' },
                { icon: Camera, text: 'Props para fotos' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${ACCENT_COLOR}20` }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{item.text}</span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/5215512345678?text=Hola!%20Quiero%20cotizar%20servicios%20de%20diseño%20para%20mi%20evento"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full transition-colors"
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              Solicitar Diseño
            </a>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-3xl shadow-2xl shadow-amber-200/50 p-8">
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl mb-4">💍</p>
                  <p className="font-black text-2xl text-zinc-900">J & M</p>
                  <p className="text-zinc-500 text-sm">15 de Marzo, 2026</p>
                  <p className="text-zinc-400 text-xs mt-2 font-mono">SAMPLE DESIGN</p>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-3xl">🎨</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SocialPage() {
  return (
    <main>
      <SolutionHero
        tag="Eventos Sociales"
        title="MOMENTOS"
        titleAccent="ÚNICOS"
        description="Bodas, XV años, cumpleaños y celebraciones especiales. Creamos merchandise que tus invitados guardarán para siempre."
        imageUrl="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200"
        accentColor={ACCENT_COLOR}
        stats={[
          { value: '25+', label: 'MOQ Mínimo' },
          { value: '100%', label: 'Personalizable' },
          { value: '∞', label: 'Recuerdos' },
        ]}
        ctaText="Cotizar Evento"
        ctaHref="#kits"
      />

      {/* Design Services Banner */}
      <DesignServicesSection />

      <section id="kits">
        <PreBuiltKits
          title="Kits para Eventos"
          subtitle="Ideas probadas que encantan a los invitados. Personaliza cada detalle."
          kits={socialKits}
          accentColor={ACCENT_COLOR}
        />
      </section>

      <FilteredCatalog
        title="Productos Populares"
        subtitle="Los más solicitados para eventos sociales y celebraciones."
        categories={['textil', 'drinkware', 'accessories', 'packaging']}
        accentColor={ACCENT_COLOR}
        maxItems={8}
      />

      {/* Testimonial */}
      <section className="py-24 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">💬</div>
          <blockquote className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6 leading-relaxed">
            &ldquo;Los hangover kits fueron el HIT de nuestra boda. Todos nos
            preguntan dónde los hicimos.&rdquo;
          </blockquote>
          <cite className="text-zinc-500 not-italic">
            — María & Juan, Boda en Valle de Bravo
          </cite>
        </div>
      </section>

      <Footer />
    </main>
  );
}
