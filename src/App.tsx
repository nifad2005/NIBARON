/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function App() {
  const brands = [
    'NIBARON Electronics',
    'NIBARON Technology',
    'R&D',
  ];

  return (
    <div 
      id="app-root" 
      className="min-h-screen bg-white text-neutral-900 flex flex-col justify-center px-6 sm:px-12 md:px-24 max-w-4xl mx-auto py-16 selection:bg-neutral-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <h1 
            id="company-title" 
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-neutral-950 uppercase"
          >
            NIBARON
          </h1>
          
          <p 
            id="company-subtitle" 
            className="text-xl sm:text-2xl text-neutral-500 font-normal tracking-wide max-w-2xl"
          >
            We work with problems and solutions.
          </p>
        </div>

        <div id="brands-container" className="pt-8">
          <ul id="brands-list" className="space-y-3">
            {brands.map((brand, index) => (
              <li 
                key={brand} 
                id={`brand-item-${index}`}
                className="text-lg sm:text-xl text-neutral-800 font-medium tracking-tight"
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

