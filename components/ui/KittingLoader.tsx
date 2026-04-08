'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// KITTING LOADER — Kit Assembly Animation
// ============================================
//
// Reliability: Uses a deterministic timeline with a hard
// safety timeout. The parent controls mount/unmount via
// `onLoadingComplete` callback — the loader never manages
// its own visibility, eliminating the "stuck loader" bug.
// ============================================

interface KittingLoaderProps {
  onLoadingComplete: () => void;
}

// ---- SVG Icon Components (2px stroke, no fill) ----

function BoxOpen() {
  return (
    <g>
      {/* Box body */}
      <motion.rect
        x="14"
        y="42"
        width="72"
        height="40"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      {/* Bottom line (box floor detail) */}
      <motion.line
        x1="14"
        y1="82"
        x2="86"
        y2="82"
        stroke="currentColor"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      {/* Left flap (open) */}
      <motion.path
        d="M14 42 L14 30 L36 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      {/* Right flap (open) */}
      <motion.path
        d="M86 42 L86 30 L64 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </g>
  );
}

function BoxClosed() {
  return (
    <g>
      {/* Box body */}
      <rect
        x="14"
        y="42"
        width="72"
        height="40"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Bottom line */}
      <line
        x1="14"
        y1="82"
        x2="86"
        y2="82"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Left flap (closed) */}
      <motion.path
        d="M14 42 L14 36 L50 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ d: 'M14 42 L14 30 L36 26' }}
        animate={{ d: 'M14 42 L14 36 L50 32' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      {/* Right flap (closed) */}
      <motion.path
        d="M86 42 L86 36 L50 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ d: 'M86 42 L86 30 L64 26' }}
        animate={{ d: 'M86 42 L86 36 L50 32' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      {/* Center tape line */}
      <motion.line
        x1="50"
        y1="32"
        x2="50"
        y2="42"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      />
    </g>
  );
}

// Hoodie icon (simplified outline)
function HoodieIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* Body */}
      <path
        d="M6 12 L6 26 L22 26 L22 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Shoulders + Hood */}
      <path
        d="M6 12 L2 16 L6 18 M22 12 L26 16 L22 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Hood arc */}
      <path
        d="M6 12 C6 4 22 4 22 12"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Center line */}
      <line x1="14" y1="14" x2="14" y2="26" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

// Tumbler icon (simplified outline)
function TumblerIcon() {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
      {/* Body */}
      <path
        d="M3 4 L5 26 L15 26 L17 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Lid */}
      <rect x="2" y="1" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Lid knob */}
      <line x1="8" y1="1" x2="12" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Band */}
      <path d="M4 12 L16 12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Notebook icon (simplified outline)
function NotebookIcon() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      {/* Cover */}
      <rect x="3" y="2" width="16" height="24" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Spine */}
      <line x1="3" y1="2" x2="3" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Elastic band */}
      <line x1="15" y1="2" x2="15" y2="26" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      {/* Lines */}
      <line x1="7" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="7" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1" />
      <line x1="7" y1="17" x2="11" y2="17" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Checkmark
function Checkmark() {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <circle cx="16" cy="16" r="14" stroke="#FF007F" strokeWidth="2" fill="none" />
      <motion.path
        d="M10 16 L14 20 L22 12"
        stroke="#FF007F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      />
    </motion.svg>
  );
}

// ---- Drop Item Wrapper ----
function DropItem({
  children,
  delay,
  xOffset,
}: {
  children: React.ReactNode;
  delay: number;
  xOffset: number;
}) {
  return (
    <motion.div
      className="absolute text-zinc-900"
      style={{ left: `calc(50% + ${xOffset}px)`, translateX: '-50%' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 18,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
}

// ---- Animation Phases ----
type Phase = 'setup' | 'dropping' | 'sealing' | 'check' | 'exit';

const TIMINGS = {
  setup: 400,       // box draws in
  drop1: 500,       // hoodie drops
  drop2: 800,       // tumbler drops
  drop3: 1100,      // notebook drops
  seal: 1500,       // flaps close
  check: 1900,      // checkmark appears
  exit: 2300,       // exit animation starts
  complete: 2900,   // safety: force callback
} as const;

export default function KittingLoader({ onLoadingComplete }: KittingLoaderProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase('dropping'), TIMINGS.setup));
    timers.push(setTimeout(() => setPhase('sealing'), TIMINGS.seal));
    timers.push(setTimeout(() => setPhase('check'), TIMINGS.check));
    timers.push(setTimeout(() => setExiting(true), TIMINGS.exit));

    // SAFETY: Hard timeout guarantees callback fires no matter what.
    // This is the critical bug fix — if framer-motion's onAnimationComplete
    // fails to fire (race condition, tab switch, etc.), we still unmount.
    timers.push(setTimeout(() => onLoadingComplete(), TIMINGS.complete));

    return () => timers.forEach(clearTimeout);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="kitting-loader"
          className="fixed inset-0 z-[100] bg-zinc-50 flex items-center justify-center select-none"
          exit={{ y: '-100vh', opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationComplete={(def) => {
            // When the exit animation completes, notify parent.
            // The safety timeout above is the backup.
            if (typeof def === 'object' && 'y' in def) {
              onLoadingComplete();
            }
          }}
        >
          {/* Grid background */}
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

          {/* Top Left */}
          <motion.div
            className="absolute top-6 left-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              SOZO_MANUFACTURING_LAB
            </span>
          </motion.div>

          {/* Top Right */}
          <motion.div
            className="absolute top-6 right-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              KITTING_SEQUENCE
            </span>
          </motion.div>

          {/* Center Assembly Area */}
          <motion.div
            className="relative"
            animate={
              phase === 'check'
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }
            }
            transition={
              phase === 'check'
                ? { duration: 0.3, ease: 'easeOut' }
                : {}
            }
          >
            {/* Label above box */}
            <motion.p
              className="text-center font-mono text-xs uppercase tracking-[0.25em] text-zinc-400 mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {phase === 'setup' && 'PREPARANDO_EMPAQUE'}
              {phase === 'dropping' && 'AGREGANDO_PRODUCTOS'}
              {phase === 'sealing' && 'SELLANDO_CAJA'}
              {phase === 'check' && 'KIT_LISTO'}
              {phase === 'exit' && 'KIT_LISTO'}
            </motion.p>

            {/* Checkmark — appears above box */}
            <div className="flex justify-center mb-3 h-8">
              {(phase === 'check' || phase === 'exit') && <Checkmark />}
            </div>

            {/* Box SVG Scene */}
            <div className="relative w-[100px] h-[90px] mx-auto text-zinc-900">
              <svg
                width="100"
                height="90"
                viewBox="0 0 100 90"
                fill="none"
                className="text-zinc-900"
              >
                {phase === 'sealing' || phase === 'check' || phase === 'exit' ? (
                  <BoxClosed />
                ) : (
                  <BoxOpen />
                )}
              </svg>

              {/* Dropping items — positioned inside the box area */}
              {(phase === 'dropping') && (
                <>
                  {/* Hoodie — drops first, left side */}
                  <DropItem delay={TIMINGS.drop1 / 1000 - TIMINGS.setup / 1000} xOffset={-14}>
                    <div style={{ position: 'relative', top: '16px' }}>
                      <HoodieIcon />
                    </div>
                  </DropItem>

                  {/* Tumbler — drops second, right side */}
                  <DropItem delay={TIMINGS.drop2 / 1000 - TIMINGS.setup / 1000} xOffset={14}>
                    <div style={{ position: 'relative', top: '18px' }}>
                      <TumblerIcon />
                    </div>
                  </DropItem>

                  {/* Notebook — drops third, center */}
                  <DropItem delay={TIMINGS.drop3 / 1000 - TIMINGS.setup / 1000} xOffset={0}>
                    <div style={{ position: 'relative', top: '12px' }}>
                      <NotebookIcon />
                    </div>
                  </DropItem>
                </>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {['setup', 'dropping', 'sealing', 'check'].map((step, i) => {
                const stepOrder = ['setup', 'dropping', 'sealing', 'check'];
                const currentIndex = stepOrder.indexOf(phase === 'exit' ? 'check' : phase);
                const isActive = i <= currentIndex;

                return (
                  <motion.div
                    key={step}
                    className="w-1.5 h-1.5 rounded-full"
                    animate={{
                      backgroundColor: isActive ? '#18181b' : '#d4d4d8',
                      scale: i === currentIndex ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Bottom Left */}
          <motion.div
            className="absolute bottom-6 left-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-mono text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
              {phase === 'check' || phase === 'exit' ? (
                <span className="text-zinc-900 font-bold">SYSTEM_READY: LAUNCH</span>
              ) : (
                <>ASSEMBLY_STATUS: IN_PROGRESS</>
              )}
            </p>
          </motion.div>

          {/* Bottom Right */}
          <div className="absolute bottom-6 right-6">
            <p className="font-mono text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
              SOZO MFG [V.1.0]
            </p>
          </div>

          {/* Bottom accent bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[#FF007F]"
            initial={{ width: '0%' }}
            animate={{
              width:
                phase === 'setup'
                  ? '15%'
                  : phase === 'dropping'
                    ? '55%'
                    : phase === 'sealing'
                      ? '80%'
                      : '100%',
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
