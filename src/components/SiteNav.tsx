import Link from 'next/link';
import {LocaleSwitcher} from './LocaleSwitcher';

type Locale = 'ja' | 'zh' | 'en';

type NavItem = {
  href: (locale: Locale) => string;
  label: Record<Locale, string>;
};

const NAV: NavItem[] = [
  {
    href: (l) => `/${l}`,
    label: {ja: 'ホーム', zh: '首页', en: 'Home'}
  },
  {
    href: (l) => `/${l}#spots`,
    label: {ja: 'ポイント', zh: '浪点', en: 'Spots'}
  },
  {
    href: (l) => `/${l}/groups`,
    label: {ja: 'グループ', zh: '圈子', en: 'Groups'}
  },
  {
    href: (l) => `/${l}/lessons`,
    label: {ja: 'レッスン', zh: '教程', en: 'Lessons'}
  },
  {
    href: (l) => `/${l}/safety`,
    label: {ja: '安全', zh: '安全', en: 'Safety'}
  },
  {
    href: (l) => `/${l}/news`,
    label: {ja: 'ニュース', zh: '新闻', en: 'News'}
  }
];

export function SiteNav({locale}: {locale: Locale}) {
  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center gap-1 border-b border-line bg-white/90 px-5 backdrop-blur">
      <Link
        href={`/${locale}`}
        className="mr-4 text-xl font-extrabold tracking-wide text-ocean"
      >
        Surf<span className="text-navy">ora</span>
      </Link>
      <div className="flex flex-1 flex-wrap items-center gap-0.5">
        {NAV.map((item, i) => (
          <Link
            key={i}
            href={item.href(locale)}
            className="rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-sky-brand hover:text-ocean"
          >
            {item.label[locale]}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LocaleSwitcher current={locale} />
      </div>
    </nav>
  );
}
