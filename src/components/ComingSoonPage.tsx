import Link from 'next/link';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  status: {ja: '準備中', zh: '即将上线', en: 'Coming soon'},
  back: {ja: '← ホームへ', zh: '← 回首页', en: '← Back home'}
} as const;

export function ComingSoonPage({
  emoji,
  title,
  description,
  points,
  locale
}: {
  emoji: string;
  title: string;
  description: string;
  points?: string[];
  locale: Locale;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <div
        className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-sky-brand text-5xl"
        aria-hidden
      >
        {emoji}
      </div>
      <h1 className="text-4xl font-bold text-ink sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
        {description}
      </p>

      {points && points.length > 0 && (
        <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-muted">
          {points.map((p, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-line bg-white px-4 py-2.5"
            >
              <span className="text-ocean">▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ocean">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ocean" />
        {T.status[locale]}
      </div>

      <div className="mt-6">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted transition-colors hover:text-ocean"
        >
          {T.back[locale]}
        </Link>
      </div>
    </main>
  );
}
