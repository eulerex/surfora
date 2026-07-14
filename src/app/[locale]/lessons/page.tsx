import Link from 'next/link';
import {setRequestLocale} from 'next-intl/server';
import {getAllLessons, type Locale} from '@/lib/lessons';

export const dynamic = 'force-dynamic';

const T = {
  title: {ja: 'レッスン', zh: '教程', en: 'Lessons'},
  subtitle: {
    ja: '基礎から中級テクニックまで。読んで、練習して、次の波を掴む。',
    zh: '从入门到进阶。读完、练完，抓下一道浪。',
    en: 'From basics to intermediate. Read, practice, catch the next one.'
  },
  minutes: {ja: '分', zh: '分钟', en: 'min'},
  empty: {
    ja: 'まだレッスンがありません。近日追加。',
    zh: '还没有课程，即将上线。',
    en: 'No lessons yet — coming soon.'
  }
} as const;

export default async function LessonsIndex({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const lessons = await getAllLessons(lc);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">{T.title[lc]}</h1>
        <p className="mt-2 text-muted">{T.subtitle[lc]}</p>
      </header>

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {T.empty[lc]}
        </div>
      ) : (
        <ol className="space-y-3">
          {lessons.map((l) => (
            <li key={l.meta.slug}>
              <Link
                href={`/${lc}/lessons/${l.meta.slug}`}
                className="flex items-center gap-4 rounded-2xl border-[1.5px] border-line bg-white p-5 transition-shadow hover:border-ocean/40 hover:shadow-md"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-brand text-3xl"
                  aria-hidden
                >
                  {l.meta.emoji ?? '📖'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-muted">
                      #{l.meta.order}
                    </span>
                    <h2 className="text-lg font-bold text-ink">
                      {l.meta.title}
                    </h2>
                  </div>
                  {l.meta.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {l.meta.description}
                    </p>
                  )}
                </div>
                {l.meta.minutes != null && (
                  <div className="hidden shrink-0 text-right text-xs text-muted sm:block">
                    {l.meta.minutes}
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
