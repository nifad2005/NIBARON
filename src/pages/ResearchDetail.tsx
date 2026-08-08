import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchResearches, ResearchItem } from '../lib/sheets';
import { fetchDocContent, extractYouTubeId } from '../lib/docFetcher';

export default function ResearchDetail() {
  const { researchId } = useParams<{ researchId: string }>();
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [docHtml, setDocHtml] = useState<string>('');
  const [loadingDoc, setLoadingDoc] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    fetchResearches().then((items) => {
      if (!isMounted) return;

      const normId = (researchId || '').toLowerCase().trim();
      const found = items.find((item) => item.id === normId || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normId);

      if (found) {
        setResearch(found);
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
        // Fallback search if not found directly
        if (items.length > 0) {
          const fallback = items[0];
          setResearch(fallback);
          if (fallback.fullContent) {
            setLoadingDoc(true);
            fetchDocContent(fallback.fullContent).then((html) => {
              if (isMounted) {
                setDocHtml(html);
                setLoadingDoc(false);
              }
            });
          }
        } else {
          setLoadingDoc(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [researchId]);

  const youtubeId = research?.videoUrl ? extractYouTubeId(research.videoUrl) : null;

  return (
    <div 
      id="research-detail-page" 
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
          <Link to="/rnd" className="hover:text-neutral-900 transition-colors">
            R&D
          </Link>
        </div>

        {research && (
          <div className="space-y-4 border-b border-neutral-100 pb-8">
            <h1 
              id="research-title" 
              className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 uppercase"
            >
              {research.name}
            </h1>
            
            {research.shortDescription && (
              <p 
                id="research-subtitle" 
                className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-2xl"
              >
                {research.shortDescription}
              </p>
            )}
          </div>
        )}

        {/* Video Section if available */}
        {youtubeId && (
          <div id="video-container" className="my-8">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                title={research?.name || 'Research Video'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Document Native Render Section */}
        <div id="research-content" className="pt-4">
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

      {/* Footer */}
      <footer id="research-footer" className="pt-16 text-xs text-neutral-400 flex items-center justify-between border-t border-neutral-100 mt-16">
        <Link to="/" className="hover:text-neutral-900 transition-colors">NIBARON</Link>
        <Link to="/rnd" className="hover:text-neutral-900 font-medium transition-colors">R&D</Link>
      </footer>
    </div>
  );
}
