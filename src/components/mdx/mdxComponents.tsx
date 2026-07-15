import type {MDXRemoteProps} from 'next-mdx-remote/rsc';
import {YouTube} from './YouTube';
import {SpotLink} from './SpotLink';

type Locale = 'ja' | 'zh' | 'en';

/** Base tags — Tailwind styling for headings/paragraphs/lists inside MDX. */
const baseComponents: MDXRemoteProps['components'] = {
  h1: (props) => (
    <h1
      className="mt-10 text-4xl font-bold tracking-tight text-ink"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 border-l-4 border-ocean pl-3 text-2xl font-bold text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-semibold text-ink" {...props} />
  ),
  p: (props) => (
    <p className="mt-4 leading-7 text-ink" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-4 space-y-1.5 pl-6 text-ink [list-style:disc]" {...props} />
  ),
  ol: (props) => (
    <ol
      className="mt-4 space-y-1.5 pl-6 text-ink [list-style:decimal]"
      {...props}
    />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  a: ({href, ...props}) => (
    <a
      href={href}
      className="text-ocean underline decoration-ocean/40 underline-offset-2 hover:decoration-ocean"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-sky-brand bg-sky-brand/40 py-3 pl-4 pr-3 text-ink"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-line px-1.5 py-0.5 text-[0.9em] text-navy"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-line" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      className="my-6 rounded-xl border border-line"
      loading="lazy"
      {...props}
    />
  ),

  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-sky-brand" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => (
    <tr className="border-b border-line last:border-b-0 hover:bg-sky-brand/30" {...props} />
  ),
  th: (props) => (
    <th className="px-3 py-2.5 text-left font-semibold text-navy" {...props} />
  ),
  td: (props) => <td className="px-3 py-2.5 text-ink align-top" {...props} />
};

export function makeLessonMdxComponents(
  locale: Locale
): MDXRemoteProps['components'] {
  return {
    ...baseComponents,
    YouTube,
    // Bind current locale so lesson authors just write <SpotLink slug="kugenuma">…</SpotLink>
    SpotLink: (props: {slug: string; children: React.ReactNode}) => (
      <SpotLink {...props} locale={locale} />
    )
  };
}
