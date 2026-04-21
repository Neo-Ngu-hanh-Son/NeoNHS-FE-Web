import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagicBorderProps {
  children: React.ReactNode;
  isGenerating: boolean;
  className?: string;
}

export function MagicBorder({ children, isGenerating, className }: MagicBorderProps) {
  return (
    <div className={cn('relative rounded-xl transition-all duration-500', className)}>
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="magic-effects" // Unique key ensures clean mount/unmount
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            {/* 1. The Rotating Primary Beam */}
            <div className="absolute inset-[-2px] overflow-hidden rounded-xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,hsl(var(--primary))_180deg,transparent_240deg)]"
              />
            </div>

            {/* 2. The Soft Theme Glow (Pulse) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 0.4 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
              className="absolute inset-0 bg-primary/30 blur-2xl rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The Content Container */}
      <div
        className={cn(
          'relative z-10 h-full w-full bg-transparent transition-all duration-500 rounded-[calc(var(--radius)-2px)] ',
          isGenerating ? 'shadow-2xl shadow-primary/40 ring-0 border-transparent' : '',
        )}
      >
        {children}
      </div>
    </div>
  );
}
