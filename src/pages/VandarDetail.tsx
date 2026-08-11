import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchVandar, VandarItem } from '../lib/sheets';
import { fetchDocContent, extractYouTubeId } from '../lib/docFetcher';
import Footer from '../components/Footer';

export default function VandarDetail() {
  const { vandarId } = useParams<{ vandarId: string }>();
  const [item, setItem] = useState<VandarItem | null>(null);
  const [docHtml, setDocHtml] = useState<string>('');
  const [loadingDoc, setLoadingDoc] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    fetchVandar().then((items) => {
      if (!isMounted) return;

      const normId = (vandarId || '').toLowerCase().trim();
      const found = items.find((it) => it.id === normId || it.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normId);

      if (found) {
        setItem(found);
        if (found.fullContent) {
          setLoadingDoc(true);
          fetchDocContent(found.fullContent).then((html) => {
            if (isMounted) {
              setDocHtml(html);
              setLoadingDoc(false);
            }
          });
        } else {
          setLoadingDoc(false);
        }
      } else {
        setLoadingDoc(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [vandarId]);

  const youtubeId = item?.videoUrl ? extractYouTubeId(item.videoUrl) : null;

  return (
    <div 
      id="vandar-detail-page" 
      className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between px-6 sm:px-12 md:px-24 max-w-4xl mx-auto py-16 selection:bg-neutral-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-10 my-auto"
      >
        <div className="flex items-center space-x-4 text-sm text-neutral-400 font-medium tracking-widest uppercase">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            NIBARON
          </Link>
          <span>/</span>
          <Link to="/vandar" className="hover:text-neutral-900 transition-colors">
            VANDAR
          </Link>
        </div>

        {item ? (
          <div className="space-y-4 border-b border-neutral-100 pb-8">
            <h1 
              id="vandar-item-title" 
              className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 uppercase"
            >
              {item.name}
            </h1>
            
            {item.shortDescription && (
              <p 
                id="vandar-item-subtitle" 
                className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-2xl"
              >
                {item.shortDescription}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 border-b border-neutral-100 pb-8">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 uppercase">
              {(vandarId || 'VANDAR').replace(/-/g, ' ')}
            </h1>
          </div>
        )}

        {/* Video Section if available */}
        {youtubeId && (
          <div id="video-container" className="my-8">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                title={item?.name || 'Vandar Video'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Document Native Render Section */}
        <div id="vandar-item-content" className="pt-4">
          {loadingDoc ? (
            <div className="text-neutral-400 text-sm py-8 animate-pulse">Loading document content...</div>
          ) : docHtml ? (
            <div 
              className="doc-content" 
              dangerouslySetInnerHTML={{ __html: docHtml }} 
            />
          ) : (
            <div className="text-neutral-400 text-sm py-4">No additional document content available.</div>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
