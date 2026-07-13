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
    <div className="flex items-center gap-0.5 rounded-full border border-line bg-white px-0.5 py-0.5 text-xs">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, {locale: loc})}
          className={
            loc === current
              ? 'rounded-full bg-navy px-2.5 py-1 font-semibold text-white'
              : 'rounded-full px-2.5 py-1 text-muted transition-colors hover:text-navy'
          }
          aria-current={loc === current}
        >
          {LABEL[loc as Locale]}
        </button>
      ))}
    </div>
  );
}
