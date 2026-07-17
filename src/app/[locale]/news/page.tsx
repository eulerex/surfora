import {setRequestLocale} from 'next-intl/server';
import {fetchNews, summarize, type NewsTag} from '@/lib/news';

export const dynamic = 'force-dynamic';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  title: {ja: 'ニュース', zh: '新闻', en: 'News'},
  subtitle: {
    ja: '湘南・千葉・宮崎・天気・大会などの最新記事。AI が自動で要約。',
    zh: '湘南 · 千叶 · 宫崎 · 天气 · 赛事最新新闻。AI 自动摘要。',
    en: 'Latest from Shonan, Chiba, Miyazaki, weather, contests. AI-summarized.'
  },
  source: {ja: '出典', zh: '来源', en: 'Source'},
  readOriginal: {
    ja: '元記事を読む',
    zh: '看原文',
    en: 'Read original'
  },
  empty: {
    ja: '今取得できるニュースがありません。',
    zh: '暂时没有可显示的新闻。',
    en: 'No news to show right now.'
  },
  filter: {ja: 'カテゴリ', zh: '分类', en: 'Filter'},
  filters: {
    all: {ja: 'すべて', zh: '全部', en: 'All'},
    shonan: {ja: '湘南', zh: '湘南', en: 'Shonan'},
    chiba: {ja: '千葉', zh: '千叶', en: 'Chiba'},
    kyushu: {ja: '九州', zh: '九州', en: 'Kyushu'},
    weather: {ja: '天気・うねり', zh: '天气·涌浪', en: 'Weather'},
    wsl: {ja: 'WSL/大会', zh: '赛事', en: 'WSL/Contest'},
    gear: {ja: '装備', zh: '装备', en: 'Gear'}
  },
  lastUpdated: {
    ja: '最終取得',
    zh: '最后抓取',
    en: 'Last updated'
  }
} as const;

const TAG_COLOR: Record<NewsTag, string> = {
  shonan: 'bg-sky-brand text-ocean',
  chiba: 'bg-[#eef8f1] text-green-brand',
  kyushu: 'bg-[#fef3e7] text-yellow-brand',
  weather: 'bg-red-brand/10 text-red-brand',
  wsl: 'bg-navy/10 text-navy',
  gear: 'bg-line text-muted',
  general: 'bg-line text-muted'
};

function relativeTime(iso: string, locale: Locale): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  const m = Math.floor(d / 30);
  return `${m}mo`;
}

export default async function NewsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const {items, fetchedAt} = await fetchNews(30);

  // Generate all summaries in parallel — cached individually.
  const summaries = await Promise.all(items.map((i) => summarize(i, lc)));

  const fetchedLocal = new Date(fetchedAt).toLocaleString(
    lc === 'ja' ? 'ja-JP' : lc === 'zh' ? 'zh-CN' : 'en-US',
    {
      timeZone: 'Asia/Tokyo',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="mb-8">
        <div className="mb-2 inline-block rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy">
          📰 {T.title[lc]}
        </div>
        <h1 className="text-4xl font-bold">{T.title[lc]}</h1>
        <p className="mt-2 text-muted">{T.subtitle[lc]}</p>
        <p className="mt-1 text-xs text-muted">
          {T.lastUpdated[lc]}: {fetchedLocal} (JST)
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {T.empty[lc]}
        </div>
      ) : (
        <ol className="space-y-4">
          {items.map((item, i) => {
            const summary = summaries[i];
            const tagLabel =
              T.filters[item.tag as keyof typeof T.filters]?.[lc] ?? item.tag;
            return (
              <li
                key={item.id}
                className="rounded-2xl border-[1.5px] border-line bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={
                      'rounded-full px-2 py-0.5 font-semibold ' +
                      TAG_COLOR[item.tag]
                    }
                  >
                    {tagLabel}
                  </span>
                  <span className="text-muted">
                    {relativeTime(item.publishedAt, lc)} · {item.source}
                  </span>
                </div>

                <h2 className="text-lg font-bold leading-snug text-ink">
                  {item.title}
                </h2>

                {summary && (
                  <p className="mt-2 rounded-lg bg-sky-brand/60 px-3 py-2 text-[13.5px] leading-relaxed text-navy">
                    {summary}
                  </p>
                )}

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-ocean transition-colors hover:underline"
                >
                  {T.readOriginal[lc]} →
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
