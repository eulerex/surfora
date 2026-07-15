import 'server-only';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Locale = 'ja' | 'zh' | 'en';

export type ContentFrontmatter = {
  slug: string;
  order: number;
  minutes?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  severity?: 'INFO' | 'CAUTION' | 'CRITICAL';
  title: string;
  description?: string;
  emoji?: string;
};

export type Article = {
  meta: ContentFrontmatter;
  content: string;
  locale: Locale;
};

async function readIfExists(fp: string): Promise<string | null> {
  try {
    return await fs.readFile(fp, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Generic reader for content/<type>/<locale>/<slug>.mdx trees.
 * Each collection (lessons, safety, news, ...) gets its own reader
 * bound to a root directory.
 */
export function createContentReader(rootDirName: string) {
  const CONTENT_ROOT = path.join(process.cwd(), 'content', rootDirName);

  async function listSlugs(locale: Locale): Promise<string[]> {
    const dir = path.join(CONTENT_ROOT, locale);
    try {
      const entries = await fs.readdir(dir);
      return entries
        .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
        .map((f) => f.replace(/\.mdx?$/, ''));
    } catch {
      return [];
    }
  }

  async function loadFile(
    locale: Locale,
    slug: string
  ): Promise<Article | null> {
    const dir = path.join(CONTENT_ROOT, locale);
    const raw =
      (await readIfExists(path.join(dir, `${slug}.mdx`))) ??
      (await readIfExists(path.join(dir, `${slug}.md`)));
    if (raw == null) return null;
    const parsed = matter(raw);
    const fm = parsed.data as Partial<ContentFrontmatter>;
    const meta: ContentFrontmatter = {
      slug: fm.slug ?? slug,
      order: fm.order ?? 999,
      minutes: fm.minutes,
      level: fm.level,
      severity: fm.severity,
      title: fm.title ?? slug,
      description: fm.description,
      emoji: fm.emoji
    };
    return {meta, content: parsed.content, locale};
  }

  /** Try requested locale → ja → zh → en. */
  async function get(
    locale: Locale,
    slug: string
  ): Promise<Article | null> {
    const order: Locale[] = ['ja', 'zh', 'en'];
    const tries = [locale, ...order.filter((l) => l !== locale)];
    for (const l of tries) {
      const article = await loadFile(l, slug);
      if (article) return article;
    }
    return null;
  }

  async function getAll(locale: Locale): Promise<Article[]> {
    const [jaSlugs, zhSlugs, enSlugs] = await Promise.all([
      listSlugs('ja'),
      listSlugs('zh'),
      listSlugs('en')
    ]);
    const slugs = Array.from(new Set([...jaSlugs, ...zhSlugs, ...enSlugs]));
    const articles = await Promise.all(slugs.map((s) => get(locale, s)));
    return articles
      .filter((a): a is Article => a != null)
      .sort((a, b) => a.meta.order - b.meta.order);
  }

  async function getAllSlugs(): Promise<string[]> {
    const [jaSlugs, zhSlugs, enSlugs] = await Promise.all([
      listSlugs('ja'),
      listSlugs('zh'),
      listSlugs('en')
    ]);
    return Array.from(new Set([...jaSlugs, ...zhSlugs, ...enSlugs]));
  }

  return {get, getAll, getAllSlugs};
}
