import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function RnD() {
  return (
    <div 
      id="rnd-page" 
      className="min-h-screen bg-white text-neutral-900 flex flex-col justify-center px-6 sm:px-12 md:px-24 max-w-4xl mx-auto py-16 selection:bg-neutral-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-10"
      >
        <div>
          <Link 
            to="/" 
            id="back-link" 
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest font-medium"
          >
            ← NIBARON
          </Link>
        </div>

        <div className="space-y-4">
          <h1 
            id="brand-title" 
            className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 uppercase"
          >
            R&D
          </h1>
          
          <p 
            id="brand-subtitle" 
            className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-2xl"
          >
            Research and development division focusing on experimental technologies, exploratory concepts, and core problem discovery.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
