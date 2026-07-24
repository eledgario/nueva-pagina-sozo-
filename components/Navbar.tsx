'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NavLink {
  id: string;
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { id: 'catalog', label: 'Catálogo', href: '/catalogo' },
  { id: 'lab', label: 'El Lab', href: '/#lab' },
  { id: 'process', label: 'Proceso', href: '/#process' },
  { id: 'faq', label: 'FAQ', href: '/#faq' },
];

const servicesLinks = [
  { label: 'Señalización & Displays', href: '/servicios/senalizacion', desc: 'Banners, roll-ups, stands' },
  { label: 'Reconocimientos & Premios', href: '/servicios/reconocimientos', desc: 'Medallas, trofeos, placas' },
  { label: 'Material Impreso', href: '/servicios/impresion', desc: 'Tarjetas, flyers, carpetas' },
  { label: 'Teams & Onboarding', href: '/solutions/teams', desc: 'Kits de bienvenida' },
  { label: 'Eventos Masivos', href: '/solutions/massive', desc: 'Volumen 500+ unidades' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);

  return (
    <>
      {/* Desktop Navbar - Full Width Industrial Style */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-zinc-200"
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo */}
            <Link href="/" className="flex items-center justify-center h-full px-5 bg-zinc-900 border-r border-zinc-200">
              <Image
                src="/sozo-logo.png"
                alt="SOZO MFG"
                width={100}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center h-full flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="flex items-center h-full px-6 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-r border-zinc-200"
                >
                  {link.label}
                </Link>
              ))}

              {/* Servicios Dropdown */}
              <div
                className="relative flex items-center h-full border-r border-zinc-200"
                onMouseEnter={() => setShowServicesMenu(true)}
                onMouseLeave={() => setShowServicesMenu(false)}
              >
                <button className="flex items-center gap-1 h-full px-6 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                  Servicios
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showServicesMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 bg-white border border-zinc-200 shadow-xl min-w-[260px] z-50"
                    >
                      <div className="py-2">
                        <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest px-4 py-2 border-b border-zinc-100">Producción</p>
                        {servicesLinks.slice(0, 3).map(s => (
                          <Link key={s.href} href={s.href} className="flex flex-col px-4 py-3 hover:bg-zinc-50 transition-colors">
                            <span className="text-xs font-bold text-zinc-900">{s.label}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{s.desc}</span>
                          </Link>
                        ))}
                        <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest px-4 py-2 border-t border-b border-zinc-100">Soluciones</p>
                        {servicesLinks.slice(3).map(s => (
                          <Link key={s.href} href={s.href} className="flex flex-col px-4 py-3 hover:bg-zinc-50 transition-colors">
                            <span className="text-xs font-bold text-zinc-900">{s.label}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{s.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spacer */}
              <div className="flex-1 border-r border-zinc-200 h-full" />
            </div>

            {/* Right - Actions */}
            <div className="flex items-center h-full">
              {/* Client Login (Desktop) */}
              <Link
                href="/login"
                className="hidden md:flex items-center h-full px-6 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-l border-zinc-200"
              >
                Acceso
              </Link>

              {/* Start Project Button */}
              <Link
                href="/registro"
                className="hidden sm:flex items-center h-full px-6 bg-zinc-900 hover:bg-[#FF007F] text-white font-mono text-xs uppercase tracking-wider transition-colors duration-200"
              >
                Iniciar Proyecto
                <ArrowRight className="w-3 h-3 ml-2" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center h-full w-14 text-zinc-900 hover:bg-zinc-50 transition-colors border-l border-zinc-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu - Industrial Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white"
          >
            {/* Grid Background */}
            <div className="industrial-grid" />

            {/* Header */}
            <div className="flex items-center justify-between h-14 border-b border-zinc-200">
              <div className="flex items-center justify-center h-full px-5 bg-zinc-900 border-r border-zinc-200">
                <Image
                  src="/sozo-logo.png"
                  alt="SOZO MFG"
                  width={100}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center h-full w-14 text-zinc-900 hover:bg-zinc-50 transition-colors border-l border-zinc-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col">
              {/* Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-black text-2xl uppercase tracking-tight text-zinc-900">
                      {link.label}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      0{index + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Servicios in Mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * navLinks.length }}
              >
                <div className="border-b border-zinc-200">
                  <p className="px-6 py-5 font-black text-2xl uppercase tracking-tight text-zinc-900">Servicios</p>
                  <div className="pb-3 px-6 grid grid-cols-1 gap-1">
                    {servicesLinks.map(s => (
                      <Link key={s.href} href={s.href} onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 py-1">
                        → {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Secondary Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex border-b border-zinc-200"
              >
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-4 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:bg-zinc-50 border-r border-zinc-200 text-center"
                >
                  Acceso Clientes
                </Link>
                <Link
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-4 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:bg-zinc-50 text-center"
                >
                  Contacto
                </Link>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6"
              >
                <Link
                  href="/registro"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 hover:bg-[#FF007F] text-white font-mono text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Iniciar Proyecto
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-zinc-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    CDMX / MX
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    Hybrid Manufacturing Lab
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
