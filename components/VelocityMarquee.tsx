'use client';

import { motion } from 'framer-motion';

interface VelocityMarqueeProps {
  text: string;
  speed?: number;
}

export default function VelocityMarquee({ text, speed = 50 }: VelocityMarqueeProps) {
  return (
    <div className="relative overflow-hidden bg-[#FF007F] py-4 border-y-4 border-black">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {/* Repeat the text multiple times for seamless loop */}
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="inline-block text-2xl md:text-4xl font-black text-black px-6 tracking-tighter uppercase"
            style={{
              letterSpacing: '-0.05em',
              textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
