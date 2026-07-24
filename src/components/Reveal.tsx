'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Fades + slides children in when they scroll into view. Runs once. Used to
// give the marketing sections a subtle premium feel.
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
