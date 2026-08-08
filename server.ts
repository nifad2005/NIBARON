import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Google Sheet Proxy
  app.get('/api/sheet', async (req, res) => {
    try {
      const sheetName = (req.query.sheet as string) || 'brands';
      const spreadsheetId = '1RHEk3f8K_qKBi3JFJP_1ipdj3N45vo8AA4aNVIwqDvg';
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch sheet' });
      }
      const csvText = await response.text();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      return res.send(csvText);
    } catch (error) {
      console.error('Error proxying sheet:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Route: Google Doc Content Fetcher & Cleaner
  app.get('/api/doc', async (req, res) => {
    try {
      const docUrl = req.query.url as string;
      if (!docUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
      }

      // If it's not a URL, return it as raw text
      if (!docUrl.startsWith('http')) {
        return res.json({ html: `<p>${escapeHtml(docUrl)}</p>` });
      }

      // Extract Doc ID
      const match = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (!match) {
        return res.json({ html: `<p><a href="${docUrl}" target="_blank" rel="noopener noreferrer" class="underline hover:text-neutral-900">${docUrl}</a></p>` });
      }

      const docId = match[1];
      const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;

      const response = await fetch(exportUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        return res.json({ 
          html: `<p>Document could not be loaded directly. <a href="${docUrl}" target="_blank" rel="noopener noreferrer" class="underline">View original Google Doc</a></p>` 
        });
      }

      const rawHtml = await response.text();

      // Clean HTML: Extract body content & remove inline Google style bloat
      const cleanedHtml = cleanGoogleDocHtml(rawHtml);

      return res.json({ html: cleanedHtml });
    } catch (error) {
      console.error('Error fetching doc:', error);
      return res.status(500).json({ error: 'Failed to fetch doc' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanGoogleDocHtml(html: string): string {
  // Extract content inside <body>...</body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Remove <style>...</style> blocks from inside body
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Clean Google redirect links (e.g., https://www.google.com/url?q=REAL_URL&sa=...)
  content = content.replace(/href="https?:\/\/(?:www\.)?google\.com\/url\?q=([^&"]+)[^"]*"/gi, (match, p1) => {
    return `href="${decodeURIComponent(p1)}" target="_blank" rel="noopener noreferrer"`;
  });

  // Remove class attributes and inline style attributes that override background/font-family
  content = content.replace(/\s*class="[^"]*"/gi, '');
  
  // Remove background-color, font-family, color, and margin from inline styles while keeping basic layout if needed
  content = content.replace(/\s*style="([^"]*)"/gi, (match, styleString) => {
    const cleanedStyle = styleString
      .split(';')
      .filter((rule: string) => {
        const lower = rule.toLowerCase().trim();
        return !lower.startsWith('background') && 
               !lower.startsWith('font-family') && 
               !lower.startsWith('color') &&
               !lower.startsWith('margin');
      })
      .join(';');
    return cleanedStyle ? ` style="${cleanedStyle}"` : '';
  });

  return content;
}

startServer();
