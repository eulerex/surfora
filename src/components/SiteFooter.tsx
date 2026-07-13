type Locale = 'ja' | 'zh' | 'en';

const T = {
  disclaimer: {
    ja: '※ 予報は参考です。実際の海況は必ず現場ライブや地元サーフショップで確認してください。',
    zh: '※ 预报仅供参考。实际海况请以现场直播或本地冲浪店信息为准。',
    en: '※ Forecasts are advisory. Always confirm actual conditions via live cams or local surf shops before entering the water.'
  }
} as const;

export function SiteFooter({locale}: {locale: Locale}) {
  return (
    <footer className="mt-12 border-t border-line bg-white/40 px-5 py-6 text-center text-xs text-grey-brand">
      <p className="mb-2">{T.disclaimer[locale]}</p>
      <p>
        © {new Date().getFullYear()} Surfora · Data:{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ocean"
        >
          Open-Meteo Marine
        </a>{' '}
        ·{' '}
        <a
          href="https://www.jma.go.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ocean"
        >
          気象庁
        </a>
      </p>
    </footer>
  );
}
