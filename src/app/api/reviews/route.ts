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
  const ratingIdx = findIndex(['rating', 'stars', 'score']);

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

export async function GET(request: Request) {
  const spreadsheetId = '1ryI-xWAcoi6RQR7r-q4s4byS8f9gQUbkeSMEd0Eb7Dk';
  const gid = '2132310118';
  const gvizByGid = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
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
    const res = await fetch(gvizByGid, { cache: 'no-store' });
    const text = await res.text();
    // Basic debug logs (visible in server logs)
    console.log('[reviews] fetched', { ok: res.ok, status: res.status, length: text.length });
    const data = parseGvizJson(text);
    console.log('[reviews] parsed');
    const reviews = mapRowsToReviews(data);
    console.log('[reviews] mapped', { count: reviews.length });
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
