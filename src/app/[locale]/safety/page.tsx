import Link from 'next/link';
import {setRequestLocale} from 'next-intl/server';
import {getAllSafetyArticles} from '@/lib/safety';
import type {Locale} from '@/lib/mdxContent';

export const dynamic = 'force-dynamic';

const T = {
  title: {ja: '安全', zh: '安全', en: 'Safety'},
  subtitle: {
    ja: '海のリスクを減らすためのチェックリスト、事故と教訓、緊急対応。',
    zh: '把海里的风险降下来的清单、真实事件和教训、应急处理。',
    en: 'Checklists, real incidents & lessons, and emergency response.'
  },
  minutes: {ja: '分', zh: '分钟', en: 'min'},
  empty: {
    ja: 'まだ記事がありません。',
    zh: '还没有文章。',
    en: 'No articles yet.'
  }
} as const;

export default async function SafetyIndex({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const articles = await getAllSafetyArticles(lc);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="mb-10">
        <div className="mb-2 inline-block rounded-full bg-red-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-brand">
          🛟 {T.title[lc]}
        </div>
        <h1 className="text-4xl font-bold">{T.title[lc]}</h1>
        <p className="mt-2 text-muted">{T.subtitle[lc]}</p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {T.empty[lc]}
        </div>
      ) : (
        <ol className="space-y-3">
          {articles.map((a) => (
            <li key={a.meta.slug}>
              <Link
                href={`/${lc}/safety/${a.meta.slug}`}
                className="flex items-center gap-4 rounded-2xl border-[1.5px] border-line bg-white p-5 transition-shadow hover:border-red-brand/40 hover:shadow-md"
              >
                <div
                  className={
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl ' +
                    (a.meta.severity === 'CRITICAL'
                      ? 'bg-red-brand/10'
                      : a.meta.severity === 'CAUTION'
                        ? 'bg-yellow-brand/10'
                        : 'bg-sky-brand')
                  }
                  aria-hidden
                >
                  {a.meta.emoji ?? '🛟'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-ink">{a.meta.title}</h2>
                  {a.meta.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {a.meta.description}
                    </p>
                  )}
                </div>
                {a.meta.minutes != null && (
                  <div className="hidden shrink-0 text-right text-xs text-muted sm:block">
                    {a.meta.minutes}
                    {T.minutes[lc]}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
