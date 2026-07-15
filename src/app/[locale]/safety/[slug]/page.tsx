import Link from 'next/link';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {getSafetyArticle, getAllSafetySlugs} from '@/lib/safety';
import type {Locale} from '@/lib/mdxContent';
import {makeLessonMdxComponents} from '@/components/mdx/mdxComponents';

export const dynamic = 'force-dynamic';

const T = {
  back: {ja: '← 安全記事一覧', zh: '← 全部安全文章', en: '← All safety articles'},
  minutes: {ja: '分', zh: '分钟读完', en: 'min read'}
} as const;

export async function generateStaticParams() {
  const slugs = await getAllSafetySlugs();
  return slugs.map((slug) => ({slug}));
}

export default async function SafetyArticlePage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const article = await getSafetyArticle(lc, slug);
  if (!article) notFound();

  const components = makeLessonMdxComponents(lc);
  const isFallback = article.locale !== lc;

  const severityBadge =
    article.meta.severity === 'CRITICAL'
      ? {label: lc === 'ja' ? '重要' : lc === 'zh' ? '重要' : 'CRITICAL', color: 'bg-red-brand text-white'}
      : article.meta.severity === 'CAUTION'
        ? {label: lc === 'ja' ? '注意' : lc === 'zh' ? '注意' : 'CAUTION', color: 'bg-yellow-brand text-white'}
        : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/${lc}/safety`}
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-red-brand"
      >
        {T.back[lc]}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-red-brand">
          <span>🛟 SAFETY</span>
          {severityBadge && (
            <span className={`rounded-full px-2 py-0.5 ${severityBadge.color}`}>
              {severityBadge.label}
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
