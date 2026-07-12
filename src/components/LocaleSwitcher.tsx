'use client';

import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

type Locale = 'ja' | 'zh' | 'en';

const LABEL: Record<Locale, string> = {
  ja: '日本語',
  zh: '中文',
  en: 'EN'
};

export function LocaleSwitcher({current}: {current: Locale}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-1 py-0.5 text-xs">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, {locale: loc})}
          className={
            loc === current
              ? 'rounded-full bg-zinc-100 px-2 py-1 font-medium text-zinc-900'
              : 'rounded-full px-2 py-1 text-zinc-400 transition-colors hover:text-zinc-100'
          }
          aria-current={loc === current}
        >
          {LABEL[loc as Locale]}
        </button>
      ))}
    </div>
  );
}
