import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrandDetail from './pages/BrandDetail';
import RnDPage from './pages/RnDPage';
import ResearchDetail from './pages/ResearchDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brands/:slug" element={<BrandDetail />} />
        <Route path="/rnd" element={<RnDPage />} />
        <Route path="/rnd/:researchId" element={<ResearchDetail />} />
        <Route path="/researches" element={<RnDPage />} />
        <Route path="/researches/:researchId" element={<ResearchDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
