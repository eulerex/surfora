import Link from 'next/link';
import {setRequestLocale} from 'next-intl/server';
import {prisma} from '@/lib/prisma';
import {fetchForecast, type Forecast} from '@/lib/openMeteo';

export const dynamic = 'force-dynamic';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  tagline: {
    ja: '今日、日本のどこで乗る？',
    zh: '今天日本哪里适合冲浪？',
    en: 'Where to surf in Japan today?'
  },
  intro: {
    ja: '波と風、そして地元の癖を読み取って、日本の主要ポイントを並べて見比べます。今日行くべきか、迷ったらここへ。',
    zh: '把浪高、风、还有每个浪点的本地脾气一起摆开，直接告诉你今天该去哪。犹豫的时候来这里看。',
    en: "Wave, wind, and each spot's local quirks laid out side by side, so you can tell where to paddle out today without second-guessing."
  },
  seeSpots: {
    ja: '今日のポイントを見る',
    zh: '看今日浪点',
    en: 'See today\'s spots'
  },
  todayHighlight: {
    ja: '今日の一押し',
    zh: '今日推荐',
    en: "Today's pick"
  },
  none: {
    ja: '本日、目立って条件の良いポイントは見当たりません。',
    zh: '今日暂无明显条件优秀的浪点。',
    en: "No spot stands out today."
  }
} as const;

const REGION_LABEL: Record<string, Record<Locale, string>> = {
  SHONAN: {ja: '湘南', zh: '湘南', en: 'Shonan'},
  CHIBA: {ja: '千葉', zh: '千叶', en: 'Chiba'},
  SHIZUOKA: {ja: '静岡', zh: '静冈', en: 'Shizuoka'},
  MIYAZAKI: {ja: '宮崎', zh: '宫崎', en: 'Miyazaki'}
};

function surfScore(f: Forecast): number {
  const wave = f.waveHeight ?? 0;
  const period = f.wavePeriod ?? 0;
  const wind = f.windSpeed ?? 10;
  const waveScore = wave > 0.3 && wave < 2.5 ? Math.min(50, wave * 30) : 0;
  const periodScore = Math.min(30, period * 3);
  const windPenalty = Math.max(0, (wind - 4) * 6);
  return Math.round(waveScore + periodScore - windPenalty);
}

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const spots = await prisma.spot.findMany();
  const forecasts = await Promise.all(
    spots.map((s) => fetchForecast(s.latitude, s.longitude))
  );

  const scored = spots
    .map((s, i) => ({spot: s, forecast: forecasts[i]}))
    .filter((x): x is {spot: (typeof spots)[number]; forecast: Forecast} =>
      x.forecast != null
    )
    .map((x) => ({...x, score: surfScore(x.forecast)}))
    .sort((a, b) => b.score - a.score);

  const top = scored[0] && scored[0].score > 20 ? scored[0] : null;

  return (
    <main className="mx-auto max-w-4xl px-6 pb-16 pt-20">
      <section className="text-center">
        <h1 className="text-4xl font-light tracking-[0.25em] sm:text-6xl">
          SURFORA
        </h1>
        <p className="mt-6 text-lg text-zinc-300 sm:text-xl">{T.tagline[lc]}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
          {T.intro[lc]}
        </p>
        <Link
          href={`/${lc}/spots`}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-medium tracking-wider text-slate-950 transition-colors hover:bg-sky-400"
        >
          {T.seeSpots[lc]}
          <span aria-hidden>→</span>
        </Link>
      </section>

      {top && (
        <section className="mt-20 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-zinc-900/40 to-transparent p-6 sm:p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-sky-300">
            {T.todayHighlight[lc]}
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h2 className="text-3xl font-light">
                {lc === 'ja'
                  ? top.spot.nameJa
                  : lc === 'zh'
                    ? (top.spot.nameZh ?? top.spot.nameJa)
                    : top.spot.nameEn}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {REGION_LABEL[top.spot.region]?.[lc] ?? top.spot.region} ·{' '}
                {top.spot.nameEn}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light text-sky-300">
                {top.forecast.waveHeight?.toFixed(1) ?? '—'}
                <span className="ml-1 text-lg text-zinc-500">m</span>
              </div>
              <div className="text-xs text-zinc-500">
                {top.forecast.wavePeriod?.toFixed(0) ?? '—'}s ·{' '}
                {top.forecast.windSpeed?.toFixed(1) ?? '—'} m/s
              </div>
            </div>
          </div>
          <Link
            href={`/${lc}/spots`}
            className="mt-6 inline-block text-sm text-sky-300 underline decoration-sky-500/40 underline-offset-4 hover:text-sky-200"
          >
            {T.seeSpots[lc]} →
          </Link>
        </section>
      )}
    </main>
  );
}
