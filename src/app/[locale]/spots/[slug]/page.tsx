import Link from 'next/link';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {prisma} from '@/lib/prisma';
import {fetchForecast, compassPoint} from '@/lib/openMeteo';
import {interpretSpot} from '@/lib/interpretSpot';
import {LiveCamEmbed} from '@/components/LiveCamEmbed';
import type {Region} from '@prisma/client';

export const dynamic = 'force-dynamic';

type Locale = 'ja' | 'zh' | 'en';

const REGION_LABEL: Record<Region, Record<Locale, string>> = {
  SHONAN: {ja: '湘南', zh: '湘南', en: 'Shonan'},
  CHIBA: {ja: '千葉', zh: '千叶', en: 'Chiba'},
  SHIZUOKA: {ja: '静岡', zh: '静冈', en: 'Shizuoka'},
  MIYAZAKI: {ja: '宮崎', zh: '宫崎', en: 'Miyazaki'}
};

const T = {
  back: {ja: '← 全ポイント', zh: '← 全部浪点', en: '← All spots'},
  wave: {ja: '波高', zh: '浪高', en: 'Wave'},
  period: {ja: '周期', zh: '周期', en: 'Period'},
  wind: {ja: '風', zh: '风', en: 'Wind'},
  temp: {ja: '気温', zh: '气温', en: 'Air temp'},
  liveCams: {ja: 'ライブカメラ', zh: '直播摄像头', en: 'Live cams'},
  noForecast: {ja: '予報データなし', zh: '暂无预报', en: 'No forecast'},
  noCams: {
    ja: 'このポイントのライブカメラは未登録です。',
    zh: '此浪点尚未登记直播摄像头。',
    en: 'No live cams registered for this spot yet.'
  },
  optimalSwell: {ja: '最適スウェル向き', zh: '最优浪向', en: 'Best swell from'},
  offshoreWind: {ja: '離岸風向', zh: '离岸风向', en: 'Offshore wind'},
  boards: {ja: '推奨板型', zh: '推荐板型', en: 'Boards'},
  train: {ja: '電車で行ける', zh: '电车可达', en: 'Train accessible'},
  beginner: {ja: '初心者向け', zh: '新手友好', en: 'Beginner-friendly'}
} as const;

export default async function SpotDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const spot = await prisma.spot.findUnique({
    where: {slug},
    include: {cams: {where: {active: true}}}
  });
  if (!spot) notFound();

  const forecast = await fetchForecast(spot.latitude, spot.longitude);
  const interpretation = forecast
    ? await interpretSpot(spot, forecast, lc)
    : null;

  const name =
    lc === 'ja' ? spot.nameJa : lc === 'zh' ? (spot.nameZh ?? spot.nameJa) : spot.nameEn;
  const desc = lc === 'ja' ? spot.descJa : lc === 'zh' ? spot.descZh : spot.descEn;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href={`/${lc}/spots`}
        className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-200"
      >
        {T.back[lc]}
      </Link>

      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-sky-300">
          {REGION_LABEL[spot.region][lc]}
        </div>
        <h1 className="mt-2 text-4xl font-light sm:text-5xl">{name}</h1>
        <p className="mt-1 text-sm text-zinc-500">{spot.nameEn}</p>

        {desc && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {desc}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {spot.trainAccessible && (
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
              {T.train[lc]}
            </span>
          )}
          {spot.beginnerFriendly && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              {T.beginner[lc]}
            </span>
          )}
          {spot.boardTypes.map((b) => (
            <span
              key={b}
              className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
            >
              {b}
            </span>
          ))}
        </div>
      </header>

      {interpretation && (
        <div className="mb-8 rounded-xl border-l-2 border-sky-500/60 bg-sky-500/5 px-5 py-4 text-sky-100">
          {interpretation}
        </div>
      )}

      {forecast ? (
        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            label={T.wave[lc]}
            value={forecast.waveHeight?.toFixed(1)}
            unit="m"
            accent
          />
          <MetricCard
            label={T.period[lc]}
            value={forecast.wavePeriod?.toFixed(0)}
            unit="s"
          />
          <MetricCard
            label={T.wind[lc]}
            value={forecast.windSpeed?.toFixed(1)}
            unit="m/s"
            sub={compassPoint(forecast.windDirection)}
          />
          <MetricCard
            label={T.temp[lc]}
            value={forecast.temperature?.toFixed(0)}
            unit="°C"
          />
        </section>
      ) : (
        <p className="mb-10 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-center text-sm text-zinc-500">
          {T.noForecast[lc]}
        </p>
      )}

      {(spot.optimalSwellDir || spot.offshoreWindDir) && (
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {spot.optimalSwellDir && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                {T.optimalSwell[lc]}
              </div>
              <div className="mt-1 text-lg text-zinc-200">{spot.optimalSwellDir}</div>
            </div>
          )}
          {spot.offshoreWindDir && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500">
                {T.offshoreWind[lc]}
              </div>
              <div className="mt-1 text-lg text-zinc-200">{spot.offshoreWindDir}</div>
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-4 border-b border-zinc-800 pb-2 text-lg tracking-wider text-zinc-300">
          {T.liveCams[lc]}
        </h2>
        {spot.cams.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {spot.cams.map((cam) => (
              <LiveCamEmbed
                key={cam.id}
                cam={{
                  nameJa: cam.nameJa,
                  nameEn: cam.nameEn,
                  nameZh: cam.nameZh,
                  youtubeVideoId: cam.youtubeVideoId,
                  youtubeChannelId: cam.youtubeChannelId
                }}
                locale={lc}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 text-center text-sm text-zinc-500">
            {T.noCams[lc]}
          </p>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  unit,
  sub,
  accent
}: {
  label: string;
  value?: string;
  unit: string;
  sub?: string | null;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div
        className={
          accent
            ? 'mt-1 text-3xl font-light text-sky-300'
            : 'mt-1 text-3xl font-light text-zinc-200'
        }
      >
        {value ?? '—'}
        <span className="ml-1 text-base text-zinc-500">{unit}</span>
      </div>
      {sub && <div className="mt-0.5 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}
