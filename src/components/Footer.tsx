import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="page-footer" className="pt-16 text-xs text-neutral-400 flex items-center justify-between border-t border-neutral-100 mt-16">
      <Link to="/" className="hover:text-neutral-900 transition-colors uppercase tracking-wider font-semibold">
        NIBARON
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/rnd" id="rnd-link-footer" className="hover:text-neutral-900 font-medium transition-colors uppercase tracking-wider">
          R&D
        </Link>
        <Link to="/vandar" id="vandar-link-footer" className="hover:text-neutral-900 font-medium transition-colors uppercase tracking-wider">
          VANDAR
        </Link>
      </div>
    </footer>
  );
}
