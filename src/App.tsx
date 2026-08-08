/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Electronics from './pages/Electronics';
import Technology from './pages/Technology';
import RnD from './pages/RnD';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brands/nibaron-electronics" element={<Electronics />} />
        <Route path="/brands/electronics" element={<Electronics />} />
        <Route path="/brands/nibaron-technology" element={<Technology />} />
        <Route path="/brands/technology" element={<Technology />} />
        <Route path="/brands/rnd" element={<RnD />} />
        <Route path="/rnd" element={<RnD />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}


