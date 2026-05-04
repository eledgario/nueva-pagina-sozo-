'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Loader2 } from 'lucide-react';

type Field = 'nombre' | 'empresa' | 'email' | 'whatsapp';

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

const fields: { key: Field; label: string; placeholder: string; type: string }[] = [
  { key: 'nombre',    label: 'Nombre completo',     placeholder: 'Juan García',           type: 'text' },
  { key: 'empresa',   label: 'Empresa',             placeholder: 'ACME S.A. de C.V.',     type: 'text' },
  { key: 'email',     label: 'Correo electrónico',  placeholder: 'juan@empresa.com',       type: 'email' },
  { key: 'whatsapp',  label: 'WhatsApp',            placeholder: '+52 55 1234 5678',       type: 'tel' },
];

export default function RegistroPage() {
  const [form, setForm] = useState<FormData>({ nombre: '', empresa: '', email: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({ nombre: '', empresa: '', email: '', whatsapp: '' });
    setDone(false);
    setError('');
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Pink glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF007F]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/sozo-logo.png"
            alt="SOZO"
            width={120}
            height={40}
            className="h-10 w-auto brightness-0 invert"
          />
        </div>

        <AnimatePresence mode="wait">

          {/* Formulario */}
          {!done && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <span className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest">
                  [EXPO_REGISTRO]
                </span>
                <h1 className="text-3xl font-black text-white mt-2">
                  Déjanos tus datos
                </h1>
                <p className="text-zinc-400 mt-2 text-sm">
                  Te contactamos con información y precios de tu kit ideal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="block font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      required
                      className="w-full px-4 py-3.5 bg-zinc-800 border-2 border-zinc-700 focus:border-[#FF007F] text-white placeholder-zinc-600 font-medium text-base outline-none transition-colors"
                    />
                  </div>
                ))}

                {error && (
                  <p className="font-mono text-xs text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#FF007F] hover:bg-[#e0006f] disabled:opacity-50 text-white font-black text-base uppercase tracking-wider border-4 border-[#FF007F] transition-all mt-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Registrando...</>
                  ) : (
                    'Registrarme'
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Confirmación */}
          {done && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-[#FF007F]/10 border-2 border-[#FF007F] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#FF007F]" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-black text-white mb-3">
                ¡Listo, {form.nombre.split(' ')[0]}!
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Quedaste registrado. Pronto nos ponemos en contacto contigo con las mejores opciones para <span className="text-white font-semibold">{form.empresa}</span>.
              </p>

              <button
                onClick={handleReset}
                className="font-mono text-xs text-zinc-500 hover:text-[#FF007F] uppercase tracking-widest transition-colors"
              >
                ← Registrar otra persona
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
