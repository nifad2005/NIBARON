import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchVandar, VandarItem } from '../lib/sheets';
import Footer from '../components/Footer';

export default function VandarPage() {
  const [items, setItems] = useState<VandarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchVandar()
      .then((data) => {
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div 
      id="vandar-page" 
      className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between px-6 sm:px-12 md:px-24 max-w-4xl mx-auto py-16 selection:bg-neutral-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-12 my-auto"
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
            id="vandar-title" 
            className="text-5xl sm:text-7xl font-bold tracking-tight text-neutral-950 uppercase"
          >
            VANDAR
          </h1>
          
          <p 
            id="vandar-subtitle" 
            className="text-xl sm:text-2xl text-neutral-500 font-normal leading-relaxed max-w-2xl"
          >
            Repository and storehouse of solutions, resources, and strategic assets.
          </p>
        </div>

        <div id="vandar-items-list" className="pt-6 space-y-8">
          <div className="border-b border-neutral-100 pb-3">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
              VANDAR Archive
            </span>
          </div>

          {loading ? (
            <div className="text-neutral-400 text-sm py-4">Loading VANDAR repository...</div>
          ) : items.length === 0 ? (
            <div className="text-neutral-400 text-sm py-4">No entries found in VANDAR repository.</div>
          ) : (
            <ul className="space-y-8">
              {items.map((item) => (
                <li key={item.id} id={`vandar-item-${item.id}`}>
                  <Link 
                    to={`/vandar/${item.id}`} 
                    className="group block space-y-2 cursor-pointer"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors underline underline-offset-8 decoration-neutral-200 group-hover:decoration-neutral-950">
                      {item.name}
                    </h2>
                    {item.shortDescription && (
                      <p className="text-neutral-500 text-base sm:text-lg leading-relaxed max-w-2xl pt-1">
                        {item.shortDescription}
                      </p>
                    )}
                    <span className="inline-block text-xs uppercase tracking-wider text-neutral-400 group-hover:text-neutral-900 pt-1 font-medium transition-colors">
                      View Entry Document →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
