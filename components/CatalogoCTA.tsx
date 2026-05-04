'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

const emptyForm: FormData = { nombre: '', empresa: '', email: '', whatsapp: '' };

export default function CatalogoCTA() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function openModal() {
    setForm(emptyForm);
    setDone(false);
    setError('');
    setOpen(true);
  }

  function closeModal() {
    if (loading) return;
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/solicitar-catalogo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar');
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Section */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-xs font-bold text-[#FF007F] uppercase tracking-widest">
              [CATÁLOGO_2026]
            </span>
            <h2 className="text-5xl md:text-6xl font-black mt-3 mb-5 text-zinc-900 tracking-tight">
              MÁS DE 130
              <br />
              <span className="text-[#FF007F]">PRODUCTOS.</span>
            </h2>
            <p className="text-zinc-500 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Bebidas, tecnología, mochilas, escritura, hogar y más.
              Todos personalizables con tu marca.
            </p>

            <button
              onClick={openModal}
              className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 hover:bg-[#FF007F] text-white font-black text-base uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Pedir catálogo completo
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-zinc-400 font-mono text-xs mt-5 uppercase tracking-widest">
              Te lo enviamos directo a tu correo
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="bg-white w-full max-w-md pointer-events-auto relative shadow-2xl border-4 border-black">

                {/* Close */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">

                  {/* Form */}
                  {!done && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8"
                    >
                      <span className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-widest">
                        [SOLICITAR_CATÁLOGO]
                      </span>
                      <h2 className="text-2xl font-black text-zinc-900 mt-2 mb-1">
                        ¿A dónde te lo enviamos?
                      </h2>
                      <p className="text-zinc-500 text-sm mb-6">
                        Déjanos tus datos y te mandamos el catálogo completo con precios.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                          { key: 'nombre',   label: 'Nombre',   placeholder: 'Juan García',        type: 'text'  },
                          { key: 'empresa',  label: 'Empresa',  placeholder: 'ACME S.A. de C.V.',  type: 'text'  },
                          { key: 'email',    label: 'Correo',   placeholder: 'juan@empresa.com',    type: 'email' },
                          { key: 'whatsapp', label: 'WhatsApp', placeholder: '+52 55 1234 5678',    type: 'tel'   },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                              {f.label}
                            </label>
                            <input
                              type={f.type}
                              placeholder={f.placeholder}
                              value={form[f.key as keyof FormData]}
                              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#FF007F] text-zinc-900 placeholder-zinc-400 outline-none transition-colors text-sm"
                            />
                          </div>
                        ))}

                        {error && (
                          <p className="font-mono text-xs text-red-500 text-center">{error}</p>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 hover:bg-[#FF007F] disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mt-2"
                        >
                          {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                          ) : (
                            <><BookOpen className="w-4 h-4" /> Enviar solicitud</>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* Confirmación */}
                  {done && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.3 }}
                      className="p-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                        className="flex justify-center mb-5"
                      >
                        <div className="w-16 h-16 bg-[#FF007F]/10 border-2 border-[#FF007F] flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-[#FF007F]" />
                        </div>
                      </motion.div>
                      <h2 className="text-2xl font-black text-zinc-900 mb-2">
                        ¡Solicitud enviada!
                      </h2>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        Nuestro equipo de ventas recibió tu solicitud y te contactará pronto con el catálogo completo.
                      </p>
                      <button
                        onClick={closeModal}
                        className="font-mono text-xs text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors"
                      >
                        Cerrar
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
