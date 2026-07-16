import 'server-only';
import Parser from 'rss-parser';
import {unstable_cache} from 'next/cache';
import {chat} from './miniMax';

const parser = new Parser();

export type NewsItem = {
  id: string; // hash of URL
  title: string;
  link: string;
  publishedAt: string; // ISO
  source: string; // e.g. "asahi.com"
  snippet: string; // Google's original description (may be html)
  tag: NewsTag;
};

export type NewsTag =
  | 'shonan'
  | 'chiba'
  | 'kyushu'
  | 'typhoon'
  | 'wsl'
  | 'gear'
  | 'general';

const RSS_TIMEOUT_MS = 8000;
const RSS_CACHE_SECONDS = 900; // 15min — balances Google News refresh cadence and per-visitor freshness

type Query = {
  tag: NewsTag;
  q: string; // exact Google News query
};

// Google News RSS. Language + region + edition all pinned to Japan/ja.
// Every query keeps 'サーフィン' / 'サーフ' / 'WSL' / 'JPSA' as an
// anchor so Google's ranker doesn't drift into off-topic general news
// (typhoon coverage without surf angle, product PR, etc.).
const QUERIES: Query[] = [
  {tag: 'shonan', q: 'サーフィン 湘南'},
  {tag: 'shonan', q: 'サーフィン 鵠沼 OR 辻堂 OR 江ノ島'},
  {tag: 'chiba', q: 'サーフィン 千葉 OR 一宮'},
  {tag: 'kyushu', q: 'サーフィン 宮崎 OR 木崎浜'},
  {tag: 'typhoon', q: '台風 サーフィン うねり OR スウェル'},
  {tag: 'wsl', q: 'WSL OR JPSA サーフィン'},
  {tag: 'gear', q: 'サーフボード レビュー OR サーフィン ギア'}
];

// A hit must contain at least one of these tokens in title or snippet
// (case-insensitive) to pass the relevance gate. Everything else is
// dropped even if it came back from a query — Google's ranker leaks
// generic content, especially around typhoon / competition seasons.
const RELEVANCE_TOKENS = [
  'サーフ',
  '波乗り',
  'うねり',
  'スウェル',
  'ライディング',
  'ロングボード',
  'ショートボード',
  'ウェットスーツ',
  'wsl',
  'jpsa',
  'isa',
  'wcs',
  'ct',
  'surf',
  'swell',
  '冲浪',
  '沖浪'
];

function isRelevant(item: {title: string; snippet: string}): boolean {
  const haystack = `${item.title}\n${item.snippet}`.toLowerCase();
  return RELEVANCE_TOKENS.some((t) => haystack.includes(t));
}

function googleNewsUrl(q: string): string {
  const params = new URLSearchParams({
    q,
    hl: 'ja',
    gl: 'JP',
    ceid: 'JP:ja'
  });
  return `https://news.google.com/rss/search?${params}`;
}

async function hashHex(s: string): Promise<string> {
  const enc = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest('SHA-1', enc);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function sourceOf(link: string): string {
  try {
    const url = new URL(link);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

/** Fetch one Google News RSS query and normalize items. */
async function fetchOne(query: Query): Promise<NewsItem[]> {
  const url = googleNewsUrl(query.q);
  try {
    const res = await fetch(url, {
      next: {revalidate: RSS_CACHE_SECONDS},
      signal: AbortSignal.timeout(RSS_TIMEOUT_MS)
    });
    if (!res.ok) {
      console.error(`[news] non-ok for "${query.q}": ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const feed = await parser.parseString(xml);

    return Promise.all(
      (feed.items ?? []).slice(0, 15).map(async (item): Promise<NewsItem> => {
        const link = item.link ?? '';
        return {
          id: await hashHex(link || item.title || Math.random().toString()),
          title: item.title ?? '(no title)',
          link,
          publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
          source: sourceOf(link),
          snippet: item.contentSnippet ?? item.content ?? '',
          tag: query.tag
        };
      })
    );
  } catch (e) {
    console.error(
      `[news] fetch failed for "${query.q}":`,
      e instanceof Error ? e.message : e
    );
    return [];
  }
}

export type NewsFeed = {
  items: NewsItem[];
  fetchedAt: string; // ISO — when the aggregated feed was assembled
};

/** Aggregate all queries, filter for relevance, dedupe by link, sort newest first. */
export async function fetchNews(limit = 30): Promise<NewsFeed> {
  const allBatches = await Promise.all(QUERIES.map(fetchOne));
  const merged: NewsItem[] = allBatches.flat().filter(isRelevant);

  const byLink = new Map<string, NewsItem>();
  for (const item of merged) {
    if (!item.link) continue;
    const existing = byLink.get(item.link);
    if (!existing) {
      byLink.set(item.link, item);
    }
  }

  const items = Array.from(byLink.values())
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);

  return {items, fetchedAt: new Date().toISOString()};
}

type Locale = 'ja' | 'zh' | 'en';

const SUMMARY_SYSTEM: Record<Locale, string> = {
  ja: 'あなたはサーフィンニュースの日本語要約者です。与えられたタイトル + 概要から、2-3 文（60-120 文字）で日本語の要約を書いてください。事実のみ、感想なし、前置きなし、要約のみを返す。',
  zh: '你是冲浪新闻的中文摘要师。给你的是日文标题+描述，你返回中文摘要，2-3 句、60-120 字。只讲事实、不加评论、不加前置、只返回摘要正文。',
  en: 'You summarize surf news into English. Given a Japanese title + snippet, return a 2-3 sentence English summary (60-120 words). Facts only, no commentary, no preamble, just the summary.'
};

async function generateSummary(
  item: NewsItem,
  locale: Locale
): Promise<string | null> {
  const userPrompt = `【タイトル】${item.title}\n\n【概要】${item.snippet || '(なし)'}`;
  return chat({
    system: SUMMARY_SYSTEM[locale],
    messages: [{role: 'user', content: userPrompt}],
    maxTokens: 1500,
    temperature: 0.4
  });
}

/**
 * Cached per (item.id, locale). Same news item + same locale reuses the
 * MiniMax result for 24h, keeping cost bounded to ~30 calls / news refresh /
 * locale.
 */
export async function summarize(
  item: NewsItem,
  locale: Locale
): Promise<string | null> {
  const cached = unstable_cache(
    async () => generateSummary(item, locale),
    ['news-summary', item.id, locale],
    {revalidate: 86400, tags: ['news-summary']}
  );
  return cached();
}
