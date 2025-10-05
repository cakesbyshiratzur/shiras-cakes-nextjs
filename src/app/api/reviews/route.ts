import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Review = { name: string; review: string; rating?: number };

// Minimal GViz response types
type GvizCell = { v?: unknown };
type GvizRow = { c?: GvizCell[] };
type GvizCol = { label?: unknown };
type GvizTable = { cols?: GvizCol[]; rows?: GvizRow[] };
type GvizResponse = { table?: GvizTable };

// In-memory cache (per server instance)
const TTL_MS = 5 * 60 * 1000; // 5 minutes
let cachedPayload: { reviews: Review[]; updatedAt: string; error?: string } | null = null;
let cachedAt = 0;

function parseGvizJson(text: string): GvizResponse {
  const regex = /setResponse\(([\s\S]*?)\);?\s*$/;
  const match = regex.exec(text);
  if (!match || !match[1]) {
    throw new Error('Invalid GViz payload');
  }
  const inner = match[1];
  return JSON.parse(inner) as GvizResponse;
}

function clampRating(val: number | undefined): number | undefined {
  if (typeof val !== 'number' || Number.isNaN(val)) return undefined;
  return Math.max(0, Math.min(5, Math.round(val)));
}

function sanitizeText(input: string): string {
  if (!input) return '';
  const withoutTags = input.replace(/<[^>]*>/g, '');
  const withoutComments = withoutTags.replace(/\/\*[^]*?\*\/|\/\/[^\n]*$/gm, '');
  return withoutComments.replace(/\s+/g, ' ').trim();
}

function looksLikeCode(input: string): boolean {
  if (!input) return false;
  const patterns = [/function\s+[\w$]+\s*\(/i, /document\./i, /window\./i, /=>/, /sourceMappingURL/i, /var\s+[\w$]+/i];
  return input.length > 800 || patterns.some((p) => p.test(input));
}

function mapRowsToReviews(data: GvizResponse): Review[] {
  const cols: string[] = (data?.table?.cols || []).map((c: GvizCol) => (c?.label || '').toString().toLowerCase());
  const rows: GvizRow[] = data?.table?.rows || [];
  const findIndex = (c: string[]) => cols.findIndex((lbl) => c.some((n) => lbl.includes(n)));
  const nameIdx = findIndex(['name', 'customer', 'author']);
  const reviewIdx = findIndex(['review', 'testimonial', 'feedback', 'comment', 'message']);
  const ratingIdx = findIndex(['rating', 'stars', 'score', 'satisfied', 'scale']);

  const mapped: Review[] = rows
    .map((r: GvizRow) => {
      const cells: GvizCell[] = r?.c || [];
      const nameVal = (nameIdx >= 0 ? cells[nameIdx]?.v : cells[0]?.v) ?? '';
      const reviewVal = (reviewIdx >= 0 ? cells[reviewIdx]?.v : cells[1]?.v) ?? '';
      const ratingRaw: unknown = ratingIdx >= 0 ? cells[ratingIdx]?.v : undefined;
      const name = sanitizeText(String(nameVal));
      const review = sanitizeText(String(reviewVal));
      let ratingNum: number | undefined;
      if (typeof ratingRaw === 'number') {
        ratingNum = ratingRaw;
      } else if (typeof ratingRaw === 'string') {
        const parsed = parseFloat(ratingRaw);
        ratingNum = Number.isFinite(parsed) ? parsed : undefined;
      } else {
        ratingNum = undefined;
      }
      return { name, review, rating: clampRating(ratingNum) };
    })
    .filter((r: Review) => r.name && r.review && !looksLikeCode(r.review))
    .slice(0, 24);

  return mapped;
}

function parseCsvToReviews(csvText: string): Review[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return []; // Need at least header + 1 data row
  
  const headers = lines[0].split(',').map(h => h.toLowerCase().trim());
  const findIndex = (c: string[]) => headers.findIndex((h) => c.some((n) => h.includes(n)));
  const nameIdx = findIndex(['name', 'customer', 'author']);
  const reviewIdx = findIndex(['review', 'testimonial', 'feedback', 'comment', 'message']);
  const ratingIdx = findIndex(['rating', 'stars', 'score', 'satisfied', 'scale']);

  const reviews: Review[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length < 2) continue;
    
    const name = sanitizeText(nameIdx >= 0 ? values[nameIdx] : values[0] || 'Anonymous');
    const review = sanitizeText(reviewIdx >= 0 ? values[reviewIdx] : values[1] || '');
    const ratingRaw = ratingIdx >= 0 ? values[ratingIdx] : undefined;
    
    let ratingNum: number | undefined;
    if (ratingRaw) {
      const parsed = parseFloat(ratingRaw);
      ratingNum = Number.isFinite(parsed) ? parsed : undefined;
    }
    
    if (name && review && !looksLikeCode(review)) {
      reviews.push({ name, review, rating: clampRating(ratingNum) });
    }
  }
  
  return reviews.slice(0, 24);
}

export async function GET(request: Request) {
  // Use the actual Google Sheets responses
  const spreadsheetId = '1WYTp1S9nkmDKVah-SKuulQIj45q8iJ6v0yJjQVa6gZc';
  const gid = '475271293';
  const gvizByGid = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
  
  // Alternative: try CSV export (more likely to be public)
  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  
  const now = Date.now();
  const url = new URL(request.url);
  const refresh = url.searchParams.get('refresh') === '1';

  // Serve from cache when fresh and not forced to refresh
  if (!refresh && cachedPayload && now - cachedAt < TTL_MS) {
    return NextResponse.json(cachedPayload, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
        'X-Reviews-Cache': 'HIT',
      },
    });
  }

  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    console.log('[reviews] attempting to fetch from:', gvizByGid);
    
    let res = await fetch(gvizByGid, { 
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    let text = await res.text();
    console.log('[reviews] JSON API response', { ok: res.ok, status: res.status, length: text.length });
    
    let reviews: Review[] = [];
    
    if (res.ok && text.length > 100) {
      // Try JSON API first
      try {
        const data = parseGvizJson(text);
        console.log('[reviews] parsed JSON');
        reviews = mapRowsToReviews(data);
        console.log('[reviews] mapped from JSON', { count: reviews.length });
      } catch (jsonErr) {
        console.log('[reviews] JSON parsing failed, trying CSV');
        throw jsonErr;
      }
    } else {
      // Fallback to CSV export
      console.log('[reviews] JSON API failed, trying CSV export:', csvUrl);
      const csvController = new AbortController();
      const csvTimeoutId = setTimeout(() => csvController.abort(), 10000);
      
      res = await fetch(csvUrl, { 
        cache: 'no-store',
        signal: csvController.signal
      });
      clearTimeout(csvTimeoutId);
      
      text = await res.text();
      console.log('[reviews] CSV response', { ok: res.ok, status: res.status, length: text.length });
      
      if (res.ok && text.length > 10) {
        reviews = parseCsvToReviews(text);
        console.log('[reviews] parsed CSV', { count: reviews.length });
      } else {
        throw new Error(`Both JSON and CSV failed. JSON: ${res.status}, CSV: ${res.status}`);
      }
    }
    
    cachedPayload = { reviews, updatedAt: new Date().toISOString() };
    cachedAt = now;
    return NextResponse.json(cachedPayload, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
        'X-Reviews-Cache': 'MISS',
      },
    });
  } catch (err: unknown) {
    console.error('[reviews] error', err);
    if (cachedPayload) {
      // Serve stale cache if available
      return NextResponse.json(cachedPayload, {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
          'X-Reviews-Cache': 'STALE',
        },
      });
    }
    const message = err instanceof Error ? err.message : 'Failed to load reviews';
    return NextResponse.json({ reviews: [], error: message }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Reviews-Cache': 'ERROR',
      },
    });
  }
}
