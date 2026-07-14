import 'server-only';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'lessons');

export type Locale = 'ja' | 'zh' | 'en';

export type LessonFrontmatter = {
  slug: string;
  order: number;
  minutes?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  title: string;
  description?: string;
  emoji?: string;
};

export type Lesson = {
  meta: LessonFrontmatter;
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
): Promise<Lesson | null> {
  const dir = path.join(CONTENT_ROOT, locale);
  const raw =
    (await readIfExists(path.join(dir, `${slug}.mdx`))) ??
    (await readIfExists(path.join(dir, `${slug}.md`)));
  if (raw == null) return null;
  const parsed = matter(raw);
  const fm = parsed.data as Partial<LessonFrontmatter>;
  const meta: LessonFrontmatter = {
    slug: fm.slug ?? slug,
    order: fm.order ?? 999,
    minutes: fm.minutes,
    level: fm.level,
    title: fm.title ?? slug,
    description: fm.description,
    emoji: fm.emoji
  };
  return {meta, content: parsed.content, locale};
}

/**
 * Prefer requested locale; fall back to whichever other locale exists.
 * Order tried: requested → ja → zh → en. Author writes in whichever
 * language, everyone still sees something.
 */
export async function getLesson(
  locale: Locale,
  slug: string
): Promise<Lesson | null> {
  const order: Locale[] = ['ja', 'zh', 'en'];
  const tries = [locale, ...order.filter((l) => l !== locale)];
  for (const l of tries) {
    const lesson = await loadFile(l, slug);
    if (lesson) return lesson;
  }
  return null;
}

export async function getAllLessons(locale: Locale): Promise<Lesson[]> {
  // Union of slugs across locales — every lesson shows up even if only ja
  // exists, and getLesson() will fall back to ja for other locales.
  const [jaSlugs, zhSlugs, enSlugs] = await Promise.all([
    listSlugs('ja'),
    listSlugs('zh'),
    listSlugs('en')
  ]);
  const slugs = Array.from(new Set([...jaSlugs, ...zhSlugs, ...enSlugs]));
  const lessons = await Promise.all(slugs.map((s) => getLesson(locale, s)));
  return lessons
    .filter((l): l is Lesson => l != null)
    .sort((a, b) => a.meta.order - b.meta.order);
}

export async function getAllSlugs(): Promise<string[]> {
  const [jaSlugs, zhSlugs, enSlugs] = await Promise.all([
    listSlugs('ja'),
    listSlugs('zh'),
    listSlugs('en')
  ]);
  return Array.from(new Set([...jaSlugs, ...zhSlugs, ...enSlugs]));
}
