import Link from 'next/link';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {getGearArticle, getAllGearSlugs} from '@/lib/gear';
import type {Locale} from '@/lib/mdxContent';
import {makeLessonMdxComponents} from '@/components/mdx/mdxComponents';

export const dynamic = 'force-dynamic';

const T = {
  back: {ja: '← ギア一覧', zh: '← 全部装备文章', en: '← All gear articles'},
  minutes: {ja: '分', zh: '分钟读完', en: 'min read'},
  levels: {
    BEGINNER: {ja: '初心者', zh: '新手', en: 'BEGINNER'},
    INTERMEDIATE: {ja: '中級', zh: '进阶', en: 'INTERMEDIATE'},
    ADVANCED: {ja: '上級', zh: '高手', en: 'ADVANCED'}
  }
} as const;

export async function generateStaticParams() {
  const slugs = await getAllGearSlugs();
  return slugs.map((slug) => ({slug}));
}

export default async function GearArticlePage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const article = await getGearArticle(lc, slug);
  if (!article) notFound();

  const components = makeLessonMdxComponents(lc);
  const isFallback = article.locale !== lc;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/${lc}/gear`}
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-ocean"
      >
        {T.back[lc]}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-ocean">
          <span>🛹 GEAR</span>
          {article.meta.level && (
            <span className="rounded-full bg-ocean/10 px-2 py-0.5 text-ocean">
              {T.levels[article.meta.level][lc]}
            </span>
          )}
          {article.meta.minutes != null && (
            <span className="text-muted">
              · {article.meta.minutes} {T.minutes[lc]}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
          {article.meta.emoji && <span className="mr-2">{article.meta.emoji}</span>}
          {article.meta.title}
        </h1>
        {article.meta.description && (
          <p className="mt-3 text-lg text-muted">{article.meta.description}</p>
        )}
        {isFallback && (
          <p className="mt-4 rounded-lg border border-dashed border-line bg-white px-3 py-2 text-xs text-muted">
            {lc === 'ja'
              ? '⚠️ この記事はまだ日本語版のみです。'
              : lc === 'zh'
                ? '⚠️ 这篇文章当前只有其他语言版本。'
                : '⚠️ Only another language version is available so far.'}
          </p>
        )}
      </header>

      <article className="text-[15.5px]">
        <MDXRemote
          source={article.content}
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
