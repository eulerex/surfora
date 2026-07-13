import Link from 'next/link';
import {LocaleSwitcher} from './LocaleSwitcher';

type Locale = 'ja' | 'zh' | 'en';

const NAV = {
  home: {ja: 'ホーム', zh: '首页', en: 'Home'},
  spots: {ja: 'ポイント', zh: '浪点', en: 'Spots'},
  live: {ja: 'ライブ', zh: '直播', en: 'Live'}
} as const;

export function SiteNav({locale}: {locale: Locale}) {
  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center gap-1.5 border-b border-line bg-white/90 px-5 backdrop-blur">
      <Link
        href={`/${locale}`}
        className="mr-5 text-xl font-extrabold tracking-wide text-ocean"
      >
        Surf<span className="text-navy">ora</span>
      </Link>
      <Link
        href={`/${locale}`}
        className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sky-brand hover:text-ocean"
      >
        {NAV.home[locale]}
      </Link>
      <Link
        href={`/${locale}/spots`}
        className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sky-brand hover:text-ocean"
      >
        {NAV.spots[locale]}
      </Link>
      <Link
        href={`/${locale}/spots`}
        className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sky-brand hover:text-ocean"
      >
        {NAV.live[locale]}
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <LocaleSwitcher current={locale} />
      </div>
    </nav>
  );
}
