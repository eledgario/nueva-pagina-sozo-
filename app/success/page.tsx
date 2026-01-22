'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Clock, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// Animated Checkmark Component
function AnimatedCheckmark() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-[#FF007F]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Inner Fill */}
      <motion.div
        className="absolute inset-2 rounded-full bg-[#FF007F]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      />

      {/* Checkmark SVG */}
      <svg
        className="absolute inset-0 w-full h-full p-6"
        viewBox="0 0 24 24"
        fill="none"
      >
        <motion.path
          d="M4 12.5L9.5 18L20 6"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeInOut' }}
        />
      </svg>

      {/* Sparkle Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#FF007F] rounded-full"
          style={{
            top: '50%',
            left: '50%',
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * 60 * Math.PI) / 180) * 80,
            y: Math.sin((i * 60 * Math.PI) / 180) * 80,
          }}
          transition={{
            duration: 0.8,
            delay: 0.6 + i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Timeline Step Component
function TimelineStep({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#FF007F]" />
      </div>
      <div>
        <h4 className="font-bold text-zinc-900">{title}</h4>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after checkmark animation
    const timer = setTimeout(() => {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF007F', '#8b5cf6', '#06b6d4', '#f59e0b'],
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Animated Checkmark */}
        <AnimatedCheckmark />

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [SOLICITUD_CONFIRMADA]
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight mb-6">
            SOLICITUD
            <br />
            <span className="text-[#FF007F]">RECIBIDA</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xl text-zinc-500 mb-12 max-w-lg mx-auto leading-relaxed"
        >
          Tu proyecto esta seguro en nuestro sistema. Uno de nuestros{' '}
          <span className="text-zinc-900 font-semibold">Producers</span> te
          contactara por WhatsApp en menos de{' '}
          <span className="text-[#FF007F] font-bold">2 horas</span> con tu
          propuesta visual.
        </motion.p>

        {/* What Happens Next - Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white border border-zinc-200 rounded-3xl p-8 mb-8 text-left shadow-sm"
        >
          <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
            Que sigue?
          </h3>

          <div className="space-y-6">
            <TimelineStep
              icon={Clock}
              title="Revision del equipo"
              description="Nuestros designers revisan tu solicitud y preparan mockups."
              delay={1.4}
            />
            <TimelineStep
              icon={MessageCircle}
              title="Contacto por WhatsApp"
              description="Te enviamos propuesta visual con precios en menos de 2hrs."
              delay={1.5}
            />
            <TimelineStep
              icon={Shield}
              title="Produccion segura"
              description="Una vez aprobado, iniciamos produccion con tracking en vivo."
              delay={1.6}
            />
            <TimelineStep
              icon={Sparkles}
              title="Entrega premium"
              description="Recibe tu pedido con empaque de autor y soporte post-venta."
              delay={1.7}
            />
          </div>
        </motion.div>

        {/* Order Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="bg-zinc-100 border border-zinc-200 rounded-2xl px-6 py-4 inline-block mb-8"
        >
          <p className="text-zinc-500 text-sm font-mono">
            Guarda este numero de referencia
          </p>
          <p className="text-zinc-900 font-bold font-mono text-lg">
            SOZO-{Date.now().toString(36).toUpperCase()}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-[#FF007F] text-white font-bold rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>

          <a
            href="https://wa.me/5215512345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-full transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar Ahora
          </a>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 }}
          className="text-zinc-400 text-sm mt-12"
        >
          Tambien te enviamos un email de confirmacion.
          <br />
          Revisa tu bandeja de spam si no lo encuentras.
        </motion.p>
      </div>
    </div>
  );
}
