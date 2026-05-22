'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Settings, Sparkles } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

type Mode = 'magic' | 'password';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/portal';

  const [mode, setMode] = useState<Mode>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!supabaseConfigured) {
      setError('El sistema de autenticación no está configurado. Contacta al administrador.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setMagicSent(true);
    } catch {
      setError('Error al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!supabaseConfigured) {
      setError('El sistema de autenticación no está configurado. Contacta al administrador.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : authError.message);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Error al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setMagicSent(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-black text-3xl tracking-tighter text-zinc-900">SOZO</span>
            <span className="px-2 py-1 bg-[#FF007F] text-white text-xs font-bold rounded-full">MFG</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Acceso a la Plataforma</h1>
          <p className="text-sm text-zinc-500 mt-2">Revisa tus pedidos y aprueba tus artes</p>
        </div>

        {/* Mode tabs */}
        <div className="px-8 mb-6">
          <div className="flex bg-zinc-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => switchMode('magic')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'magic' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Link mágico
            </button>
            <button
              onClick={() => switchMode('password')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'password' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <Lock className="w-4 h-4" />
              Contraseña
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Dev Warning */}
          {!supabaseConfigured && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
              <Settings className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Modo Desarrollo</p>
                <p className="mt-1">Supabase no está configurado. Agrega las variables de entorno para habilitar la autenticación.</p>
              </div>
            </div>
          )}

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ── Magic link sent ── */}
            {mode === 'magic' && magicSent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <p className="font-bold text-zinc-900 mb-1">¡Revisa tu correo!</p>
                <p className="text-sm text-zinc-500 mb-6">
                  Enviamos un enlace de acceso a <span className="font-medium text-zinc-700">{email}</span>.
                  El enlace expira en 10 minutos.
                </p>
                <button
                  onClick={() => setMagicSent(false)}
                  className="text-sm text-[#FF007F] hover:underline"
                >
                  Usar otro correo
                </button>
              </motion.div>

            ) : mode === 'magic' ? (
              /* ── Magic link form ── */
              <motion.form
                key="magic-form"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onSubmit={handleMagicLink}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="email-magic" className="block text-sm font-medium text-zinc-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="email-magic"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tu@empresa.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    Te enviamos un enlace seguro — sin contraseña.
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="w-full py-4 bg-[#FF007F] hover:bg-[#e0006f] disabled:bg-zinc-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Enviando enlace...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Enviar enlace de acceso</>
                  )}
                </motion.button>
              </motion.form>

            ) : (
              /* ── Password form ── */
              <motion.form
                key="password-form"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handlePassword}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="email-pw" className="block text-sm font-medium text-zinc-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="email-pw"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tu@empresa.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Verificando...</>
                  ) : (
                    'Acceder a la Plataforma'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-zinc-50 border-t border-zinc-100">
          <p className="text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{' '}
            <a href="mailto:hola@sozo.mx" className="font-medium text-[#FF007F] hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-zinc-400">Conexión segura con cifrado SSL</p>
      </div>
    </motion.div>
  );
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="p-6 text-center">
        <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          SOZO Manufacturing Lab // CDMX
        </p>
      </div>
    </div>
  );
}
