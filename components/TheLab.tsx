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
    name: 'SERIGRAFÍA: The Fabric Lab',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop',
    materials: ['Algodón Heavyweight', 'Canvas (Totes)', 'Poliéster Técnico'],
    category: 'serigrafia',
  },
  {
    id: 'laser-1',
    name: 'LÁSER: The Hard Goods Lab',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2087&auto=format&fit=crop',
    materials: ['Acero Inoxidable', 'Aluminio Anodizado', 'Acrílico Translúcido', 'Madera de Encino'],
    category: 'laser',
  },
  {
    id: '3d-1',
    name: '3D PRINT: The Additive Lab',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
    materials: ['Fibra de Carbono', 'Filamento Mármol', 'TPU Flexible', 'Resina de Alta Definición'],
    category: '3d',
  },
  {
    id: 'uv-1',
    name: 'UV PRINT: The Texture Lab',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop',
    materials: ['Cerámica Mate', 'Vidrio', 'Plásticos de Ingeniería', 'Stickers 3D'],
    category: 'uv',
  },
  {
    id: 'serigrafia-2',
    name: 'SERIGRAFÍA: Puff Ink Relief',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
    materials: ['Relieve 3D (Puff)', 'Foil Metalizado', 'Discharge Eco'],
    category: 'serigrafia',
  },
  {
    id: 'laser-2',
    name: 'LÁSER: Precision Engraving',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2074&auto=format&fit=crop',
    materials: ['Grabado Fibra', 'CO2 Marking', 'Corte de Precisión'],
    category: 'laser',
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
        title: 'Proceso de Separación de Color',
        description: 'Sistema CMYK + Pantone para reproducciones exactas en textil heavyweight.',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'serigrafia-p2',
        title: 'Muestras de Tinta Puff en Hoodie',
        description: 'Relieve 3D permanente. 2-3mm de altura, efecto premium en logos y tipografía.',
        imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'serigrafia-p3',
        title: 'Impresión en Empaque de Cartón Rígido',
        description: 'Serigrafía directa en cajas personalizadas. Durabilidad industrial para packaging premium.',
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'serigrafia-p4',
        title: 'Foil Metalizado Gold/Silver',
        description: 'Hot stamping en textil oscuro. Acabado reflectante permanente.',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2012&auto=format&fit=crop',
      },
      {
        id: 'serigrafia-p5',
        title: 'Discharge Printing Ecológico',
        description: 'Tinta base agua que "quita" el color del textil. Ultra suave, sin capa superficial.',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
      },
      {
        id: 'serigrafia-p6',
        title: 'Canvas Tote Bags',
        description: 'Impresión en algodón 100% natural. Ideal para merch sustentable.',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2012&auto=format&fit=crop',
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
        title: 'Estructuras Paramétricas',
        description: 'Diseño generativo con Grasshopper. Soportes de celular con geometría compleja.',
        imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '3d-p2',
        title: 'Trofeos con Filamento Metálico',
        description: 'PLA infused con partículas de bronce/aluminio. Acabado pulido a mano.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop',
      },
      {
        id: '3d-p3',
        title: 'Soportes con Fibra de Carbono',
        description: 'Filamento técnico reforzado. Resistencia mecánica superior, peso ultraligero.',
        imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '3d-p4',
        title: 'Keycaps Artesanales Resina',
        description: 'Impresión SLA con resina transparente/opaca. Post-proceso con pintura a mano.',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2065&auto=format&fit=crop',
      },
      {
        id: '3d-p5',
        title: 'Organizadores de Escritorio',
        description: 'Multi-material print. Combinación de rígido + flexible en una sola pieza.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop',
      },
      {
        id: '3d-p6',
        title: 'Prototipos Funcionales',
        description: 'Iteración rápida. De CAD a pieza física en menos de 24 horas.',
        imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
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
        title: 'Grabado Rotativo en Termos',
        description: 'Fiber laser en acero inoxidable. Marcaje permanente resistente a 10,000+ lavadas.',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2087&auto=format&fit=crop',
      },
      {
        id: 'laser-p2',
        title: 'Corte de Precisión en Acrílico Neón',
        description: 'Laser CO2 80W. Bordes pulidos por llama, sin post-proceso.',
        imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2074&auto=format&fit=crop',
      },
      {
        id: 'laser-p3',
        title: 'Detalle en Cuero Sintético',
        description: 'Grabado de alto contraste. Ideal para patches, etiquetas y accesorios.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'laser-p4',
        title: 'Aluminio Anodizado Negro',
        description: 'Marcaje en contraste blanco. Perfecto para tech accessories y gadgets.',
        imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop',
      },
      {
        id: 'laser-p5',
        title: 'Madera de Encino Natural',
        description: 'Grabado profundo con tono oscurecido. Laptop skins y placas decorativas.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'laser-p6',
        title: 'NFC Cards Acrílico Negro',
        description: 'Corte + grabado + chip integrado. La última tarjeta de presentación.',
        imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2074&auto=format&fit=crop',
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
        title: 'Efecto Barniz a Registro',
        description: 'Spot UV sobre mate. Contraste brillante/mate para logos con relieve visual.',
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'uv-p2',
        title: 'Impresión en Tazas de Cerámica',
        description: 'UV direct print en acabado rubber. Tazas mate con impresión full-color permanente.',
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'uv-p3',
        title: 'Stickers 3D con Textura',
        description: 'Tinta UV en capas. Relieve táctil de 1-2mm, resistente a intemperie.',
        imageUrl: 'https://images.unsplash.com/photo-1611329532992-0b7d94e8dc26?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'uv-p4',
        title: 'Botellas Metálicas Powder-Coated',
        description: 'Impresión directa en superficies curvas. Full-color sin serigrafía.',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2087&auto=format&fit=crop',
      },
      {
        id: 'uv-p5',
        title: 'Vidrio Transparente',
        description: 'Capa blanca + CMYK. Impresión opaca en vidrio cristalino.',
        imageUrl: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=2080&auto=format&fit=crop',
      },
      {
        id: 'uv-p6',
        title: 'Plásticos de Ingeniería',
        description: 'ABS, PC, PETG. Adhesión permanente sin primers ni tratamientos.',
        imageUrl: 'https://images.unsplash.com/photo-1611329532992-0b7d94e8dc26?q=80&w=2070&auto=format&fit=crop',
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
