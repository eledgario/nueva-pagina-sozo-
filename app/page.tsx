'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Hexagon, Shield, Rocket, Package } from 'lucide-react';
import Image from 'next/image';
import CuratedCatalog from '@/components/CuratedCatalog';
import VelocityMarquee from '@/components/VelocityMarquee';
import TiltCard from '@/components/TiltCard';
import MagneticButton from '@/components/MagneticButton';
import OrderWizard from '@/components/OrderWizard';
import OrderProcess from '@/components/OrderProcess';
import TheDrops from '@/components/TheDrops';
import TheArsenal from '@/components/TheArsenal';
import ProjectConfigurator from '@/components/ProjectConfigurator';
import TheLab from '@/components/TheLab';
import HeroMarquee from '@/components/HeroMarquee';
import HeroWorkbench from '@/components/HeroWorkbench';
import HeroKinetic from '@/components/HeroKinetic';
import HeroVerticalChain from '@/components/HeroVerticalChain';
import SolutionsGrid from '@/components/SolutionsGrid';
import TrustMarquee from '@/components/TrustMarquee';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function SozoLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased relative overflow-x-hidden">
      {/* Industrial Paper Noise Texture */}
      <div className="industrial-noise" />

      {/* Technical Blueprint Grid */}
      <div className="blueprint-grid" />

      {/* Rotating Sticker - Updated for Light Mode */}
      <motion.div
        className="fixed top-28 right-6 z-50 w-20 h-20 bg-[#FF007F] rounded-full flex items-center justify-center border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hidden lg:flex"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <span className="text-black font-black text-[10px] text-center leading-tight">
          NEW<br/>DROP
        </span>
      </motion.div>

      {/* Hero Section - Vertical Supply Chain */}
      <HeroVerticalChain />

      {/* Trust Marquee - Company Logos */}
      <TrustMarquee />

      {/* Solutions Grid - Business Verticals */}
      <SolutionsGrid />

      {/* THE SOZO FLOW - End-to-End Platform */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
              [PLATAFORMA_COMPLETA]
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
              ASÍ
              <br />
              <span className="text-[#FF007F]">FUNCIONA</span>
            </h2>
            <p className="text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed">
              No somos una agencia. Somos tu{' '}
              <span className="text-zinc-900 font-bold tracking-tight">infraestructura de kits completa</span>: diseño, producción, almacén y envíos.
            </p>
          </motion.div>

          {/* 3-Step Flow with Connectors */}
          <div className="relative">
            {/* Arrow Connectors (Desktop Only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 1" preserveAspectRatio="none">
                <motion.line
                  x1="15"
                  y1="0.5"
                  x2="85"
                  y2="0.5"
                  stroke="#FF007F"
                  strokeWidth="0.15"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* STEP 1: MANUFACTURE (The Lab) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative bg-white rounded-3xl border border-zinc-200 p-8 hover:border-[#FF007F]/50 transition-all group shadow-xl shadow-zinc-200/50">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF007F] rounded-full flex items-center justify-center border-4 border-white font-black text-xl text-white shadow-lg">
                    01
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 bg-zinc-50 rounded-2xl border-2 border-zinc-200 flex items-center justify-center mb-6 group-hover:border-[#FF007F] transition-colors">
                    <Hexagon className="w-10 h-10 text-[#FF007F]" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-black mb-3 text-zinc-900">Diseño & Producción</h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Creamos tu stock con técnicas híbridas (Serigrafía + 3D + Láser). Sin mínimos absurdos.
                    </p>
                  </div>

                  {/* Label */}
                  <div className="mt-6">
                    <span className="inline-block px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-mono font-bold text-zinc-600">
                      EL LAB
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* STEP 2: WAREHOUSE (The Vault) - HIGHLIGHTED */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-3xl border-4 border-[#FF007F] p-8 transition-all group shadow-xl shadow-[#FF007F]/20">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF007F] rounded-full flex items-center justify-center border-4 border-white font-black text-xl z-10 text-white shadow-lg">
                    02
                  </div>

                  {/* "Destacado" Badge */}
                  <div className="absolute -top-3 -right-3 bg-[#FF007F] text-white px-4 py-1 rounded-full text-xs font-black uppercase border-2 border-white z-10 shadow-lg">
                    KEY VALUE
                  </div>

                  {/* Icon */}
                  <div className="relative w-20 h-20 bg-[#FF007F]/5 rounded-2xl border-2 border-[#FF007F] flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-[#FF007F]" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-black mb-3 text-zinc-900">Tu Bodega Virtual</h3>
                    <p className="text-zinc-500 leading-relaxed">
                      ¿Sin espacio? Almacenamos tus kits en CDMX. Seguro, inventariado y listo para salir.
                    </p>
                  </div>

                  {/* Label */}
                  <div className="mt-6 relative">
                    <span className="inline-block px-3 py-1 bg-[#FF007F]/10 border border-[#FF007F] rounded-full text-xs font-mono font-bold text-[#FF007F]">
                      LA BÓVEDA
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* STEP 3: DEPLOY (The Drop) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <div className="relative bg-white rounded-3xl border border-zinc-200 p-8 hover:border-[#FF007F]/50 transition-all group shadow-xl shadow-zinc-200/50">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF007F] rounded-full flex items-center justify-center border-4 border-white font-black text-xl text-white shadow-lg">
                    03
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 bg-zinc-50 rounded-2xl border-2 border-zinc-200 flex items-center justify-center mb-6 group-hover:border-[#FF007F] transition-colors">
                    <Rocket className="w-10 h-10 text-[#FF007F]" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-black mb-3 text-zinc-900">Envíos On-Demand</h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Cuando contrates a alguien, avísanos. Enviamos el kit directo a su casa (Same-Day en CDMX).
                    </p>
                  </div>

                  {/* Label */}
                  <div className="mt-6">
                    <span className="inline-block px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-mono font-bold text-zinc-600">
                      EL ENVÍO
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-12 border-t-2 border-zinc-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {[
                { icon: Shield, text: 'Inventario Asegurado' },
                { icon: Package, text: 'Cobertura Nacional' },
                { icon: Zap, text: 'Atención por WhatsApp o Dashboard' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-[#FF007F]/10 rounded-full flex items-center justify-center border border-[#FF007F]/30">
                    <badge.icon className="w-5 h-5 text-[#FF007F]" />
                  </div>
                  <span className="font-mono text-sm font-bold text-zinc-600">
                    {badge.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Velocity Scroll Marquee */}
      <VelocityMarquee text="SERIGRAFÍA INDUSTRIAL • IMPRESIÓN 3D • GRABADO LÁSER • TEXTURA UV • BORDADO PREMIUM •" speed={30} />

      {/* The Arsenal - Smart Filtered Catalog */}
      <TheArsenal />

      {/* THE SYSTEM - Process */}
      <section className="py-32 px-6 bg-zinc-100 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
              [FLUJO_DE_TRABAJO]
            </span>
            <h2 className="text-6xl md:text-7xl font-black mb-4 text-zinc-900 tracking-tight">
              EL PROCESO
            </h2>
            <p className="text-xl text-zinc-500">
              Del concepto a tu oficina. Cero fricción.
            </p>
          </motion.div>

          {/* 3-Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'ELIGES',
                desc: 'Catálogo o custom. Asesoramos materiales y acabados.',
              },
              {
                num: '02',
                title: 'FABRICAMOS',
                desc: 'Serigrafía, Láser, 3D. Calidad industrial garantizada.',
              },
              {
                num: '03',
                title: 'ENTREGAMOS',
                desc: 'Empaque premium. Rastreo en vivo. Soporte post-entrega.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF007F] text-white font-black text-3xl mb-6 border-4 border-white shadow-lg">
                  {step.num}
                </div>
                <h3 className="text-3xl font-black mb-3 text-zinc-900">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-mono text-sm">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Process - Detailed Lifecycle */}
      <OrderProcess />

      {/* THE LAB - Upgraded with Visual Portfolio */}
      <TheLab />

      {/* Project Configurator - 3 Flows (Individual, Kits, Custom) */}
      <ProjectConfigurator />

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-32 px-6 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
              READY TO
              <br />
              <span className="text-[#FF007F]">DROP?</span>
            </h2>
            <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto">
              Cotiza tu proyecto sin compromiso. Respuesta en menos de 24hrs.
            </p>
            <MagneticButton className="inline-flex items-center gap-3 px-12 py-6 bg-[#FF007F] text-white font-black text-xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
              Iniciar Proyecto
              <ArrowRight className="w-6 h-6" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
