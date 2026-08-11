import Papa from 'papaparse';

export interface BrandItem {
  name: string;
  slug: string;
  shortDescription: string;
}

export interface DocItem {
  id: string;
  name: string;
  shortDescription: string;
  fullContent: string;
  videoUrl: string;
}

export type ResearchItem = DocItem;
export type VandarItem = DocItem;

const SPREADSHEET_ID = '1RHEk3f8K_qKBi3JFJP_1ipdj3N45vo8AA4aNVIwqDvg';

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function fetchBrands(): Promise<BrandItem[]> {
  try {
    let csvText = '';
    try {
      const apiRes = await fetch('/api/sheet?sheet=brands', { cache: 'no-cache' });
      if (apiRes.ok) {
        csvText = await apiRes.text();
      }
    } catch {
      const directUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=brands`;
      const res = await fetch(directUrl, { cache: 'no-cache' });
      if (res.ok) csvText = await res.text();
    }

    if (!csvText) {
      throw new Error('Could not fetch brands csv');
    }

    return new Promise((resolve) => {
      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const items: BrandItem[] = results.data
            .map((row) => {
              const keys = Object.keys(row);
              const nameKey = keys.find((k) => k.trim().toLowerCase() === 'name') || keys[0] || '';
              const slugKey = keys.find((k) => k.trim().toLowerCase().includes('slag') || k.trim().toLowerCase().includes('slug')) || keys[1] || '';
              const descKey = keys.find((k) => k.trim().toLowerCase().includes('description')) || keys[2] || '';

              const name = (row[nameKey] || '').trim();
              let slug = (row[slugKey] || '').trim();
              const shortDescription = (row[descKey] || '').trim();

              if (!slug && name) {
                slug = createSlug(name);
              }

              return { name, slug, shortDescription };
            })
            .filter((item) => item.name && item.slug);

          resolve(items);
        },
        error: () => resolve(getFallbackBrands()),
      });
    });
  } catch (err) {
    console.error('Error fetching brands:', err);
    return getFallbackBrands();
  }
}

export async function fetchDocItemsFromTab(sheetName: string, fallbackItems: DocItem[] = []): Promise<DocItem[]> {
  try {
    let csvText = '';
    try {
      const apiRes = await fetch(`/api/sheet?sheet=${encodeURIComponent(sheetName)}`, { cache: 'no-cache' });
      if (apiRes.ok) {
        csvText = await apiRes.text();
      }
    } catch {
      const directUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      const res = await fetch(directUrl, { cache: 'no-cache' });
      if (res.ok) csvText = await res.text();
    }

    if (!csvText) {
      return fallbackItems;
    }

    return new Promise((resolve) => {
      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const items: DocItem[] = results.data
            .map((row) => {
              const keys = Object.keys(row);
              const nameKey = keys.find((k) => k.trim().toLowerCase() === 'name') || keys[0] || '';
              const descKey = keys.find((k) => {
                const lower = k.trim().toLowerCase();
                return lower.includes('desc') || lower.includes('short');
              }) || keys[1] || '';
              const contentKey = keys.find((k) => k.trim().toLowerCase().includes('content')) || keys[2] || '';
              const videoKey = keys.find((k) => k.trim().toLowerCase().includes('video')) || keys[3] || '';

              const name = (row[nameKey] || '').trim();
              const shortDescription = (row[descKey] || '').trim();
              const fullContent = (row[contentKey] || '').trim();
              const videoUrl = (row[videoKey] || '').trim();
              const id = createSlug(name);

              return {
                id,
                name,
                shortDescription,
                fullContent,
                videoUrl,
              };
            })
            .filter((item) => item.name);

          resolve(items.length > 0 ? items : fallbackItems);
        },
        error: () => resolve(fallbackItems),
      });
    });
  } catch (err) {
    console.error(`Error fetching sheet ${sheetName}:`, err);
    return fallbackItems;
  }
}

export async function fetchResearches(): Promise<ResearchItem[]> {
  return fetchDocItemsFromTab('researches', getFallbackResearches());
}

export async function fetchVandar(): Promise<VandarItem[]> {
  return fetchDocItemsFromTab('vandar', []);
}

function getFallbackBrands(): BrandItem[] {
  return [
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
  ];
}

function getFallbackResearches(): ResearchItem[] {
  return [
    {
      id: 'ai-for-farmers',
      name: 'AI for Farmers',
      shortDescription: 'NIBARON Ai works to slove problems of farmers.',
      fullContent: 'https://docs.google.com/document/d/16ddd_krjGsB6XjMXzh-uslKjRTFtMLcxNmjnAI-F1so/edit?usp=sharing',
      videoUrl: '',
    },
  ];
}
