import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchBrands, BrandItem } from '../lib/sheets';
import Footer from '../components/Footer';

export default function Home() {
  const [brands, setBrands] = useState<BrandItem[]>([
    {
      name: 'NIBARON Electronics',
      slug: 'nibaron-electronics',
      shortDescription: 'NIBARON Electronics builds electronic products that really solve your problem',
    },
    {
      name: 'NIBARON Tech',
      slug: 'nibaron-tech',
      shortDescription: 'NIBARON Tech builds tech product that really sloves your problem',
    },
    {
      name: 'NIBARON Shanti',
      slug: 'nibaron-shanti',
      shortDescription: 'NIBARON Shanti works to solve human and world problen',
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    fetchBrands().then((items) => {
      if (isMounted && items.length > 0) {
        setBrands(items);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div 
      id="home-page" 
      className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between px-6 sm:px-12 md:px-24 max-w-4xl mx-auto py-16 selection:bg-neutral-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-12 my-auto"
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

        <div id="brands-container" className="pt-8 space-y-4">
          <ul id="brands-list" className="space-y-4">
            {brands.map((brand, index) => (
              <li key={brand.slug || index} id={`brand-item-${index}`}>
                <Link
                  to={`/brands/${brand.slug}`}
                  id={`brand-link-${index}`}
                  className="inline-block text-lg sm:text-xl text-neutral-800 hover:text-neutral-950 font-medium tracking-tight transition-colors duration-200 underline underline-offset-8 decoration-neutral-300 hover:decoration-neutral-950"
                >
                  {brand.name}
                </Link>
              </li>
            ))}
            <li id="rnd-list-item">
              <Link
                to="/rnd"
                id="rnd-link-main"
                className="inline-block text-lg sm:text-xl text-neutral-800 hover:text-neutral-950 font-medium tracking-tight transition-colors duration-200 underline underline-offset-8 decoration-neutral-300 hover:decoration-neutral-950"
              >
                R&D
              </Link>
            </li>
          </ul>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
