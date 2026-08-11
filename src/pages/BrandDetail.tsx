import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchBrands, BrandItem } from '../lib/sheets';
import Footer from '../components/Footer';

export default function BrandDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<BrandItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchBrands().then((items) => {
      if (!isMounted) return;
      
      const normalizedParamSlug = (slug || '').toLowerCase().trim();
      
      const found = items.find((item) => {
        const itemSlug = item.slug.toLowerCase().trim();
        return itemSlug === normalizedParamSlug || 
               itemSlug.replace(/-/g, '') === normalizedParamSlug.replace(/-/g, '');
      });

      if (found) {
        setBrand(found);
      } else {
        if (normalizedParamSlug.includes('electronics')) {
          setBrand({
            name: 'NIBARON Electronics',
            slug: 'nibaron-electronics',
            shortDescription: 'NIBARON Electronics builds electronic products that really solve your problem',
          });
        } else if (normalizedParamSlug.includes('tech')) {
          setBrand({
            name: 'NIBARON Tech',
            slug: 'nibaron-tech',
            shortDescription: 'NIBARON Tech builds tech product that really sloves your problem',
          });
        } else if (normalizedParamSlug.includes('shanti')) {
          setBrand({
            name: 'NIBARON Shanti',
            slug: 'nibaron-shanti',
            shortDescription: 'NIBARON Shanti works to solve human and world problen',
          });
        } else {
          const formattedName = (slug || 'Brand')
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          setBrand({
            name: formattedName.startsWith('Nibaron') ? formattedName.replace('Nibaron', 'NIBARON') : `NIBARON ${formattedName}`,
            slug: slug || '',
            shortDescription: 'Working to solve foundational problems.',
          });
        }
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div 
      id="brand-detail-page" 
      className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between px-6 sm:px-12 md:px-24 max-w-4xl mx-auto py-16 selection:bg-neutral-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-10 my-auto"
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
            {brand ? brand.name : (slug ? slug.replace(/-/g, ' ') : 'Brand')}
          </h1>
          
          <p 
            id="brand-description" 
            className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-2xl"
          >
            {brand ? brand.shortDescription : ''}
          </p>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
