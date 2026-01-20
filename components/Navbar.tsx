'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NavLink {
  id: string;
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { id: 'drops', label: 'Esenciales', href: '#drops' },
  { id: 'lab', label: 'El Lab', href: '#lab' },
  { id: 'process', label: 'Nosotros', href: '#process' },
];

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-5xl"
      >
        <div className="relative bg-white/70 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg shadow-zinc-200/20 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter text-zinc-900">
                SOZO
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-[#FF007F] text-white text-[10px] font-bold rounded-full">
                MFG
              </span>
            </Link>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {/* Animated Background Pill */}
                  {hoveredLink === link.id && (
                    <motion.div
                      layoutId="navHoverPill"
                      className="absolute inset-0 bg-zinc-100 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
              {/* Client Login (Desktop) */}
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Acceso Clientes
              </Link>

              {/* Start Project Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-[#FF007F] text-white text-sm font-bold rounded-full transition-colors duration-300"
              >
                Empezar Proyecto
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white"
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-3 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors z-10"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-zinc-900" />
            </motion.button>

            {/* Menu Content */}
            <div className="flex flex-col justify-center items-center min-h-screen px-8 py-20">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <span className="font-black text-3xl tracking-tighter text-zinc-900">
                  SOZO
                </span>
                <span className="ml-2 px-2 py-1 bg-[#FF007F] text-white text-xs font-bold rounded-full">
                  MFG
                </span>
              </motion.div>

              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-2 mb-12">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center gap-4 text-4xl md:text-5xl font-black text-zinc-900 hover:text-[#FF007F] transition-colors py-3"
                    >
                      <span className="font-mono text-sm font-normal text-zinc-400 group-hover:text-[#FF007F]">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-32 h-px bg-zinc-200 mb-8"
              />

              {/* Secondary Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-4 mb-12"
              >
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Acceso Clientes
                </Link>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-8 py-4 bg-[#FF007F] hover:bg-zinc-900 text-white font-bold text-lg rounded-full transition-colors duration-300"
                >
                  Empezar Proyecto
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-0 right-0 flex justify-center"
              >
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  CDMX // Hybrid Manufacturing Lab
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
