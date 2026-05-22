'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  imageUrl: string;
  materials: string[];
  category: 'serigrafia' | '3d' | 'laser' | 'uv';
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface LabCategory {
  id: 'serigrafia' | '3d' | 'laser' | 'uv';
  title: string;
  description: string;
  portfolioItems: PortfolioItem[];
}

const materials: Material[] = [
  {
    id: 'serigrafia-1',
    name: 'SERIGRAFÍA: Bolsas & Textiles',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778081018710x500232710744867400/TX-409_02.jpg',
    materials: ['Algodón Heavyweight', 'Canvas (Totes)', 'Poliéster Técnico'],
    category: 'serigrafia',
  },
  {
    id: 'laser-1',
    name: 'LÁSER: Termos & Metales',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775603640543x759288295926205400/TE-267_02.jpg',
    materials: ['Acero Inoxidable', 'Aluminio Anodizado', 'Acrílico Translúcido', 'Madera'],
    category: 'laser',
  },
  {
    id: 'uv-1',
    name: 'DTF UV: Hard Goods',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773073056788x656601407991168600/TH-272_02.jpg',
    materials: ['Plásticos de Ingeniería', 'Acrílico', 'Vidrio', 'Metal'],
    category: 'uv',
  },
  {
    id: 'serigrafia-2',
    name: 'TAMPOGRAFÍA: Curvas & Relieve',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773158282714x196271180865279700/TH-267_02.jpg',
    materials: ['Superficies Curvas', 'Bolígrafos', 'Gadgets', 'USB'],
    category: 'serigrafia',
  },
  {
    id: 'laser-2',
    name: 'SUBLIMACIÓN: Full Color',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778017030936x247009838287304700/ST-058_02.jpg',
    materials: ['Tazas Cerámicas', 'Textil Poliéster', 'Aluminio Sublimable'],
    category: 'laser',
  },
  {
    id: '3d-1',
    name: 'DTF TEXTIL: Sin Mínimos',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778020406984x307413490126253060/TX-394_02.jpg',
    materials: ['Full Color en Tela', 'Sin Mínimo de Piezas', 'Diseños Complejos'],
    category: '3d',
  },
];

// Expanded Portfolio Content
const labCategories: LabCategory[] = [
  {
    id: 'serigrafia',
    title: 'SERIGRAFÍA: The Fabric Lab',
    description: 'Screen printing industrial. Desde separación de color hasta tintas especiales con efectos táctiles.',
    portfolioItems: [
      {
        id: 'serigrafia-p1',
        title: 'Bolsas de Tela',
        description: 'Serigrafía en algodón y poliéster. CMYK + Pantone, hasta 6 colores, resistente al lavado.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778081018710x500232710744867400/TX-409_02.jpg',
      },
      {
        id: 'serigrafia-p2',
        title: 'Mochilas & Backpacks',
        description: 'Impresión directa en poliéster técnico. Logos grandes con alta definición.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778020406984x307413490126253060/TX-394_02.jpg',
      },
      {
        id: 'serigrafia-p3',
        title: 'Hieleras & Coolers',
        description: 'Serigrafía en poliéster reforzado. Ideal para eventos al aire libre y patrocinios.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773077746855x487804387268899700/TX-404_02.jpg',
      },
      {
        id: 'serigrafia-p4',
        title: 'Bolígrafo Serigrafía',
        description: 'Impresión de alta precisión en barra plástica. Full wrap o logo frontal.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889561474x259629390652678980/BL-057_09.jpg',
      },
      {
        id: 'serigrafia-p5',
        title: 'Sets Ejecutivos',
        description: 'Combinaciones curadas con impresión coordinada. Packaging premium opcional.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778017030936x247009838287304700/ST-058_02.jpg',
      },
      {
        id: 'serigrafia-p6',
        title: 'Bocinas & Tech',
        description: 'DTF UV directo en carcasa. Full color sin límite de colores ni mínimo de piezas.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773073056788x656601407991168600/TH-272_02.jpg',
      },
    ],
  },
  {
    id: '3d',
    title: '3D PRINT: The Additive Lab',
    description: 'Manufactura aditiva con filamentos técnicos. De prototipos rápidos a piezas funcionales.',
    portfolioItems: [
      {
        id: '3d-p1',
        title: 'DTF en Playeras & Sudaderas',
        description: 'Full color fotográfico en cualquier tela. Sin placas, sin mínimo de piezas.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778020406984x307413490126253060/TX-394_02.jpg',
      },
      {
        id: '3d-p2',
        title: 'Mochilas con Diseño Complejo',
        description: 'Diseños multicolor sin limitación de tintas. Ideal para logos con gradientes.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778081018710x500232710744867400/TX-409_02.jpg',
      },
      {
        id: '3d-p3',
        title: 'Sublimación en Vasos',
        description: 'Wrap completo 360° en tazas blancas. Full color resistente al lavavajillas.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747900822968x120981413178805170/TE-238_03.jpg',
      },
      {
        id: '3d-p4',
        title: 'Ventiladores de Cuello',
        description: 'DTF UV en carcasa plástica. Logotipo o diseño completo en producto tech.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773074219349x675271415751171800/TH-274_03.jpg',
      },
      {
        id: '3d-p5',
        title: 'Bolígrafos Premium',
        description: 'Tampografía de precisión. Hasta 4 colores con registro exacto en cualquier ángulo.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/f1747889696018x207211745608624220/BL-037_05.jpg',
      },
      {
        id: '3d-p6',
        title: 'Sets Coordinados',
        description: 'Misma técnica aplicada en todos los artículos del kit. Imagen de marca consistente.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775602779331x979863542572584100/ST-062_02.jpg',
      },
    ],
  },
  {
    id: 'laser',
    title: 'LÁSER: The Hard Goods Lab',
    description: 'Grabado permanente con fibra/CO2. Desde metales anodizados hasta acrílicos translúcidos.',
    portfolioItems: [
      {
        id: 'laser-p1',
        title: 'Termos & Vasos de Acero',
        description: 'Grabado láser permanente en acero inoxidable. Resiste lavadas y uso diario.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775603640543x759288295926205400/TE-267_02.jpg',
      },
      {
        id: 'laser-p2',
        title: 'Botella Premium',
        description: 'Silicón expandible con grabado en placa metálica. Diseño único y funcional.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778178479593x458789352973942200/TE-268_02.jpg',
      },
      {
        id: 'laser-p3',
        title: 'Libretas con Tapa Dura',
        description: 'Grabado láser en curpiel y madera. Logo con relieve sin tinta ni pintura.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778189413515x131896192704845420/ST-063_02.jpg',
      },
      {
        id: 'laser-p4',
        title: 'Power Banks',
        description: 'Tampografía de alta precisión en carcasa plástica. 2-4 colores con detalle fino.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773158282714x196271180865279700/TH-267_02.jpg',
      },
      {
        id: 'laser-p5',
        title: 'Hielera Premium',
        description: 'Grabado en placa metálica sobre hielera. Acabado premium para regalos ejecutivos.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773077746855x487804387268899700/TX-404_02.jpg',
      },
      {
        id: 'laser-p6',
        title: 'Sets Ejecutivos Completos',
        description: 'Grabado coordinado en todos los piezas del set. Presentación premium con caja.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775602779331x979863542572584100/ST-062_02.jpg',
      },
    ],
  },
  {
    id: 'uv',
    title: 'UV PRINT: The Texture Lab',
    description: 'Impresión directa con tintas UV. Efectos 3D, barniz a registro y texturas táctiles.',
    portfolioItems: [
      {
        id: 'uv-p1',
        title: 'Bocinas Bluetooth',
        description: 'DTF UV directo en carcasa plástica. Full color sin límite de colores.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773073056788x656601407991168600/TH-272_02.jpg',
      },
      {
        id: 'uv-p2',
        title: 'Power Banks & Tech',
        description: 'Impresión UV sobre aluminio y plástico. Acabado premium resistente a rayones.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773158282714x196271180865279700/TH-267_02.jpg',
      },
      {
        id: 'uv-p3',
        title: 'Ventilador de Cuello',
        description: 'Logo a color directo en plástico ABS. Sin plantilla, sin mínimo alto.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773074219349x675271415751171800/TH-274_03.jpg',
      },
      {
        id: 'uv-p4',
        title: 'Termos & Bebidas',
        description: 'Impresión directa en superficies cilíndricas. Full color sin serigrafía.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778178479593x458789352973942200/TE-268_02.jpg',
      },
      {
        id: 'uv-p5',
        title: 'Sets Ejecutivos',
        description: 'DTF UV coordinado en cada pieza del set. Imagen de marca unificada.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778189413515x131896192704845420/ST-063_02.jpg',
      },
      {
        id: 'uv-p6',
        title: 'Bolsas & Mochilas',
        description: 'UV sobre plástico y materiales sintéticos. Resistente a la intemperie.',
        imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778081018710x500232710744867400/TX-409_02.jpg',
      },
    ],
  },
];

export default function TheLab() {
  const [selectedLab, setSelectedLab] = useState<'serigrafia' | '3d' | 'laser' | 'uv' | null>(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedLab) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedLab]);

  const openModal = (category: 'serigrafia' | '3d' | 'laser' | 'uv') => {
    setSelectedLab(category);
  };

  const closeModal = () => {
    setSelectedLab(null);
  };

  const currentLabData = labCategories.find((lab) => lab.id === selectedLab);

  return (
    <>
      <section className="py-32 px-6 bg-zinc-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
              [MANUFACTURA_HÍBRIDA]
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
              EL LABORATORIO
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
              Donde la artesanía digital se encuentra con la{' '}
              <span className="text-zinc-900 font-bold">producción industrial</span>.
            </p>
          </motion.div>

          {/* Masonry Grid Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
            {materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layoutId={material.id}
                onClick={() => openModal(material.category)}
                className="group relative aspect-[4/5] cursor-pointer"
              >
                {/* Art Gallery White Frame */}
                <div className="relative w-full h-full bg-white p-6 border border-zinc-200 hover:border-[#FF007F]/50 transition-all duration-500 shadow-xl shadow-zinc-200/50">
                  {/* Image Layer */}
                  <div className="relative w-full h-full overflow-hidden bg-[#F4F4F5]">
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                      <Image
                        src={material.imageUrl}
                        alt={material.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>

                    {/* Subtle Pink Tint on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500"
                      initial={false}
                    />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                    {/* Material Name Badge */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="relative mb-4"
                    >
                      <div className="px-4 py-3 bg-white border border-zinc-200 shadow-md">
                        <h3 className="text-base md:text-lg font-black text-zinc-900 uppercase tracking-tight">
                          {material.name}
                        </h3>
                      </div>
                    </motion.div>

                    {/* Material Tags - Hidden by default, show on hover */}
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-all duration-500 space-y-2"
                      initial={false}
                    >
                      {material.materials.map((mat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="inline-block mr-2"
                        >
                          <div className="px-3 py-1 bg-white border border-zinc-200 shadow-sm">
                            <span className="text-xs font-mono text-zinc-700 font-semibold">
                              {mat}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Click to Expand hint */}
                    <motion.div
                      className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    >
                      <div className="flex items-center gap-2 text-[#FF007F] text-sm font-bold">
                        <span>Ver Portfolio Completo</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Technical Badge - Top Right Corner */}
                  <div className="absolute top-8 right-8 z-20">
                    <div className="px-3 py-1 bg-white border-2 border-[#FF007F] rounded-full shadow-lg">
                      <span className="text-xs font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                        LAB {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-zinc-500 font-mono text-sm mb-6">
              Todos los materiales incluyen tests de muestra previos.
            </p>
            <button className="px-8 py-4 bg-white border-2 border-zinc-200 hover:border-[#FF007F] rounded-2xl font-bold text-zinc-900 transition-all group shadow-md">
              <span className="group-hover:text-[#FF007F] transition-colors">
                Ver Especificaciones Técnicas Completas
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {selectedLab && currentLabData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={closeModal}
          >
            {/* Backdrop with blur */}
            <div className="absolute inset-0 backdrop-blur-2xl bg-zinc-900/80" />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-50 p-3 bg-zinc-50 rounded-full border-2 border-zinc-200 hover:border-[#FF007F] transition-all group shadow-lg"
              >
                <X className="w-6 h-6 text-zinc-900 group-hover:text-[#FF007F] transition-colors" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] p-8 md:p-12">
                {/* Header */}
                <div className="mb-12">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
                      [PORTFOLIO_EXPANDED]
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-4 text-zinc-900 tracking-tight">
                      {currentLabData.title}
                    </h2>
                    <p className="text-xl text-zinc-500 max-w-3xl">
                      {currentLabData.description}
                    </p>
                  </motion.div>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentLabData.portfolioItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="group relative aspect-[4/5] overflow-hidden bg-white border border-zinc-200 hover:border-[#FF007F]/50 transition-all cursor-pointer shadow-md p-4"
                    >
                      {/* Image */}
                      <div className="relative w-full h-2/3 overflow-hidden bg-[#F4F4F5]">
                        <motion.div
                          className="relative w-full h-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </motion.div>

                        {/* Pink Glow on Hover */}
                        <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500" />
                      </div>

                      {/* Content */}
                      <div className="pt-4">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 pt-12 border-t border-zinc-200 text-center"
                >
                  <p className="text-zinc-500 font-mono text-sm mb-6">
                    ¿Necesitas ver muestras físicas? Solicita un sample kit.
                  </p>
                  <button className="px-8 py-4 bg-[#FF007F] hover:bg-[#FF007F]/90 text-white font-bold rounded-2xl transition-all shadow-lg">
                    Solicitar Muestras Gratis
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
