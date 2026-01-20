'use client';

import { motion } from 'framer-motion';

const trustedCompanies = [
  { name: 'TechCorp', logo: 'TECHCORP' },
  { name: 'Studio A', logo: 'STUDIO A' },
  { name: 'Startup X', logo: 'STARTUP X' },
  { name: 'Fintech MX', logo: 'FINTECH MX' },
  { name: 'Growth Labs', logo: 'GROWTH LABS' },
  { name: 'Digital Co', logo: 'DIGITAL CO' },
  { name: 'Venture Hub', logo: 'VENTURE HUB' },
  { name: 'Scale Up', logo: 'SCALE UP' },
];

export default function TrustMarquee() {
  // Duplicate for seamless loop
  const duplicatedCompanies = [...trustedCompanies, ...trustedCompanies];

  return (
    <section className="py-12 bg-zinc-50 border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-center text-sm font-mono text-zinc-400 uppercase tracking-widest">
          Empresas que confían en nosotros
        </p>
      </div>

      {/* Logo Marquee */}
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <motion.div
          className="flex items-center gap-16"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 30,
              ease: 'linear',
              repeat: Infinity,
            },
          }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-12 px-8 opacity-30 hover:opacity-60 transition-opacity"
            >
              {/* Placeholder Logo - Replace with actual logos */}
              <span className="font-black text-xl md:text-2xl text-zinc-900 tracking-tight whitespace-nowrap">
                {company.logo}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
