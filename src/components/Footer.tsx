type Locale = 'ja' | 'zh' | 'en';

const T = {
  sources: {
    ja: 'データ提供',
    zh: '数据来源',
    en: 'Data'
  },
  disclaimer: {
    ja: '※ 予報は参考です。実際の海況は必ず現場ライブや地元サーフショップで確認してください。',
    zh: '※ 预报仅供参考。实际海况请以现场直播或本地冲浪店信息为准。',
    en: '※ Forecasts are advisory. Always confirm actual conditions via live cams or local surf shops before entering the water.'
  },
  builtBy: {
    ja: '個人開発プロジェクト',
    zh: '个人开发项目',
    en: 'Personal project'
  }
} as const;

export function Footer({locale}: {locale: Locale}) {
  return (
    <footer className="mt-16 border-t border-zinc-800/60 bg-black/40">
      <div className="mx-auto max-w-6xl px-6 py-8 text-xs leading-relaxed text-zinc-500">
        <p className="mb-3 text-zinc-400">{T.disclaimer[locale]}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900 pt-3">
          <div>
            <span className="text-zinc-600">{T.sources[locale]}: </span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-200"
            >
              Open-Meteo Marine
            </a>
            <span className="text-zinc-700"> · </span>
            <a
              href="https://www.jma.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-200"
            >
              JMA
            </a>
          </div>
          <div className="text-zinc-600">
            © {new Date().getFullYear()} Surfora ·{' '}
            <span className="text-zinc-700">{T.builtBy[locale]}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
