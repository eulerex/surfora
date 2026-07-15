import Link from 'next/link';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {getLesson, getAllSlugs, type Locale} from '@/lib/lessons';
import {makeLessonMdxComponents} from '@/components/mdx/mdxComponents';

export const dynamic = 'force-dynamic';

const T = {
  back: {ja: '← レッスン一覧', zh: '← 教程列表', en: '← All lessons'},
  minutes: {ja: '分', zh: '分钟读完', en: 'min read'}
} as const;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({slug}));
}

export default async function LessonPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const lesson = await getLesson(lc, slug);
  if (!lesson) notFound();

  const components = makeLessonMdxComponents(lc);
  const isFallback = lesson.locale !== lc;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/${lc}/lessons`}
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-ocean"
      >
        {T.back[lc]}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-ocean">
          <span>#{lesson.meta.order}</span>
          {lesson.meta.level && <span>· {lesson.meta.level}</span>}
          {lesson.meta.minutes != null && (
            <span>
              · {lesson.meta.minutes} {T.minutes[lc]}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
          {lesson.meta.emoji && <span className="mr-2">{lesson.meta.emoji}</span>}
          {lesson.meta.title}
        </h1>
        {lesson.meta.description && (
          <p className="mt-3 text-lg text-muted">{lesson.meta.description}</p>
        )}
        {isFallback && (
          <p className="mt-4 rounded-lg border border-dashed border-line bg-white px-3 py-2 text-xs text-muted">
            {lc === 'ja'
              ? '⚠️ この記事はまだ日本語版のみです。'
              : lc === 'zh'
                ? '⚠️ 这篇教程当前只有日文版，先给你看日文原文。'
                : '⚠️ Only a Japanese version is available so far.'}
          </p>
        )}
      </header>

      <article className="text-[15.5px]">
        <MDXRemote
          source={lesson.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm]
            }
          }}
        />
      </article>
    </main>
  );
}
