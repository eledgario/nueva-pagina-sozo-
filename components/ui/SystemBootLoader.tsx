'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// ============================================
// SYSTEM BOOT LOADER
// ============================================

interface SystemBootLoaderProps {
  children: React.ReactNode;
  /** Duration in ms for counting 0→100 */
  duration?: number;
}

// Eased counter: accelerates then decelerates
function useEasedCounter(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      // Cubic ease-out: fast start, slow finish
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, durationMs]);

  return value;
}

// Blinking cursor text
function BlinkingLine({ text }: { text: string }) {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      {text}
      <span className={showCursor ? 'opacity-100' : 'opacity-0'}>_</span>
    </span>
  );
}

// Spinning crosshair
function SpinningCrosshair() {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="text-zinc-400"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    >
      <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1" />
    </motion.svg>
  );
}

export default function SystemBootLoader({
  children,
  duration = 1500,
}: SystemBootLoaderProps) {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading');
  const count = useEasedCounter(100, duration, true);

  // Progress bar width driven by count
  const progressWidth = `${count}%`;

  // When count hits 100, begin exit
  useEffect(() => {
    if (count === 100 && phase === 'loading') {
      // Small pause at 100 for satisfaction
      const timeout = setTimeout(() => setPhase('exiting'), 200);
      return () => clearTimeout(timeout);
    }
  }, [count, phase]);

  const handleExitComplete = useCallback(() => {
    setPhase('done');
  }, []);

  // Scale for the reveal parallax effect
  const contentScale = phase === 'done' ? 1 : 1.1;

  return (
    <>
      {/* Content behind loader — scale reveal */}
      <motion.div
        animate={{ scale: contentScale }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: 'center top' }}
      >
        {children}
      </motion.div>

      {/* Loader overlay */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {phase !== 'done' && (
          <motion.div
            key="boot-loader"
            className="fixed inset-0 z-[100] bg-zinc-50 flex flex-col items-center justify-center select-none"
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Subtle grid background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />

            {/* Top Right — Spinning crosshair */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                INIT
              </span>
              <SpinningCrosshair />
            </div>

            {/* Top Left — System label */}
            <div className="absolute top-6 left-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                SOZO_MANUFACTURING_LAB
              </span>
            </div>

            {/* Center Counter */}
            <div className="relative flex flex-col items-center">
              {/* Subtle label above */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-400 mb-4"
              >
                LOADING SYSTEM
              </motion.span>

              {/* The big number */}
              <div className="relative">
                <motion.span
                  className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-black font-mono text-zinc-900 leading-none tracking-tighter tabular-nums"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(count).padStart(3, '0')}
                </motion.span>

                {/* Percent sign */}
                <span className="absolute -right-8 sm:-right-12 top-4 sm:top-8 font-mono text-2xl sm:text-4xl font-bold text-zinc-300">
                  %
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-48 sm:w-64 h-[2px] bg-zinc-200 mt-6 overflow-hidden">
                <motion.div
                  className="h-full bg-zinc-900"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            {/* Bottom Left — System check */}
            <div className="absolute bottom-6 left-6">
              <p className="font-mono text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
                {count < 30 && <BlinkingLine text="SYSTEM_CHECK: RUNNING" />}
                {count >= 30 && count < 70 && (
                  <BlinkingLine text="LOADING_MODULES: OK" />
                )}
                {count >= 70 && count < 100 && (
                  <BlinkingLine text="INITIALIZING_UI: OK" />
                )}
                {count >= 100 && (
                  <span className="text-zinc-900 font-bold">
                    SYSTEM_READY: LAUNCH
                  </span>
                )}
              </p>
            </div>

            {/* Bottom Right — Version */}
            <div className="absolute bottom-6 right-6">
              <p className="font-mono text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
                SOZO MFG [V.1.0]
              </p>
            </div>

            {/* Bottom Center — Thin accent line */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-[#FF007F]"
              initial={{ width: '0%' }}
              animate={{ width: progressWidth }}
              transition={{ ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
