import Link from 'next/link';
import {LocaleSwitcher} from './LocaleSwitcher';

type Locale = 'ja' | 'zh' | 'en';

const NAV = {
  spots: {ja: 'ポイント', zh: '浪点', en: 'Spots'}
} as const;

export function Header({locale}: {locale: Locale}) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/70 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href={`/${locale}`}
          className="text-lg font-light tracking-[0.3em] text-zinc-100 transition-colors hover:text-sky-300"
        >
          SURFORA
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={`/${locale}/spots`}
            className="text-sm tracking-wider text-zinc-400 transition-colors hover:text-zinc-100"
          >
            {NAV.spots[locale]}
          </Link>
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
