'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const solutionsLinks = [
  { label: 'Teams & Onboarding', href: '#solutions' },
  { label: 'Massive Events', href: '#solutions' },
  { label: 'Client Gifting', href: '#solutions' },
  { label: 'Social Studio', href: '#solutions' },
];

const labLinks = [
  { label: 'Catálogo', href: '#arsenal' },
  { label: 'Técnicas', href: '#lab' },
  { label: 'Proceso', href: '#process' },
  { label: 'Cotizador', href: '#configurator' },
];

const legalLinks = [
  { label: 'Aviso de Privacidad', href: '/privacy' },
  { label: 'Términos de Servicio', href: '/terms' },
  { label: 'Política de Cookies', href: '/cookies' },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/sozo' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/sozo' },
  { icon: Mail, label: 'Email', href: 'mailto:hola@sozo.mx' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left - Brand & Manifesto */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="mb-6">
                <Image
                  src="/sozo-logo.png"
                  alt="SOZO Corporate Labs"
                  width={160}
                  height={50}
                  className="h-12 w-auto object-contain brightness-0 invert"
                />
              </div>

              {/* Tagline */}
              <p className="text-lg text-zinc-400 leading-relaxed mb-6 max-w-md">
                Manufactura Híbrida & Logística.
                <br />
                <span className="text-white font-semibold">CDMX / JPN.</span>
              </p>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
                <MapPin className="w-4 h-4 text-[#FF007F]" />
                <span className="text-sm font-mono text-zinc-400">
                  Ciudad de México, MX
                </span>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-zinc-900 hover:bg-[#FF007F] border border-zinc-800 hover:border-[#FF007F] rounded-full flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Center - Solutions Links */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest mb-6">
                Soluciones
              </h4>
              <ul className="space-y-4">
                {solutionsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm font-medium group inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Center - The Lab Links */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest mb-6">
                El Lab
              </h4>
              <ul className="space-y-4">
                {labLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm font-medium group inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right - Legal Links */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest mb-6">
                Legal
              </h4>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors text-sm font-medium group inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter CTA */}
              <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <p className="text-sm font-semibold text-white mb-2">
                  Newsletter Mensual
                </p>
                <p className="text-xs text-zinc-500 mb-4">
                  Tendencias de swag y descuentos exclusivos.
                </p>
                <a
                  href="#newsletter"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FF007F] hover:text-white transition-colors"
                >
                  Suscribirse
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="font-mono text-xs text-zinc-500">
              © 2026 Sozo Inc. All systems operational.
            </p>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  API Status: Online
                </span>
              </div>
              <span className="text-zinc-700">|</span>
              <span className="font-mono text-xs text-zinc-500">
                v2.4.1
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
