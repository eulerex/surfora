import Link from 'next/link';
import {setRequestLocale} from 'next-intl/server';
import {getAllGearArticles} from '@/lib/gear';
import type {Locale} from '@/lib/mdxContent';

export const dynamic = 'force-dynamic';

const T = {
  title: {ja: 'ギア', zh: '装备', en: 'Gear'},
  subtitle: {
    ja: '初心者向けボードの選び方、人気モデル、用途別のガイド。',
    zh: '新手冲浪板怎么选、热门型号、按用途看板。',
    en: 'Beginner board picks, popular models, and use-case guides.'
  },
  levels: {
    BEGINNER: {ja: '初心者', zh: '新手', en: 'Beginner'},
    INTERMEDIATE: {ja: '中級', zh: '进阶', en: 'Intermediate'},
    ADVANCED: {ja: '上級', zh: '高手', en: 'Advanced'}
  },
  minutes: {ja: '分', zh: '分钟', en: 'min'},
  empty: {
    ja: 'まだ記事がありません。',
    zh: '还没有文章。',
    en: 'No articles yet.'
  }
} as const;

export default async function GearIndex({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const articles = await getAllGearArticles(lc);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="mb-10">
        <div className="mb-2 inline-block rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ocean">
          🛹 {T.title[lc]}
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
                href={`/${lc}/gear/${a.meta.slug}`}
                className="flex items-center gap-4 rounded-2xl border-[1.5px] border-line bg-white p-5 transition-shadow hover:border-ocean/40 hover:shadow-md"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-brand text-3xl"
                  aria-hidden
                >
                  {a.meta.emoji ?? '🏄'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-ink">{a.meta.title}</h2>
                  {a.meta.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {a.meta.description}
                    </p>
                  )}
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-right text-xs text-muted sm:flex">
                  {a.meta.level && (
                    <span className="rounded-full bg-ocean/10 px-2 py-0.5 font-semibold text-ocean">
                      {T.levels[a.meta.level][lc]}
                    </span>
                  )}
                  {a.meta.minutes != null && (
                    <span>
                      {a.meta.minutes}
                      {T.minutes[lc]}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
