export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function fetchDocContent(docUrlOrText: string): Promise<string> {
  if (!docUrlOrText) return '';

  const trimmed = docUrlOrText.trim();

  // Check if it is a Google Doc URL
  if (trimmed.includes('docs.google.com/document/d/')) {
    try {
      // 1. Try server endpoint
      const res = await fetch(`/api/doc?url=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.html) return data.html;
      }
    } catch (e) {
      console.warn('Server doc API unavailable, falling back to client fetch:', e);
    }

    // 2. Client-side fallback for Google Doc export
    try {
      const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const docId = match[1];
        const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;
        const docRes = await fetch(exportUrl);
        if (docRes.ok) {
          const rawHtml = await docRes.text();
          return cleanClientDocHtml(rawHtml);
        }
      }
    } catch (err) {
      console.error('Client doc fetch failed:', err);
    }

    return `<p>Document link: <a href="${trimmed}" target="_blank" rel="noopener noreferrer" class="underline hover:text-neutral-900">${trimmed}</a></p>`;
  }

  // Plain text / Markdown fallback: convert double newlines to paragraphs
  const paragraphs = trimmed
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return paragraphs;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanClientDocHtml(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/\s*class="[^"]*"/gi, '');
  content = content.replace(/href="https?:\/\/(?:www\.)?google\.com\/url\?q=([^&"]+)[^"]*"/gi, (_, p1) => {
    return `href="${decodeURIComponent(p1)}" target="_blank" rel="noopener noreferrer"`;
  });

  return content;
}
