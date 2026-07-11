import type {Spot, Region} from '@prisma/client';
import {setRequestLocale} from 'next-intl/server';
import {prisma} from '@/lib/prisma';
import {fetchForecast, compassPoint, type Forecast} from '@/lib/openMeteo';

export const dynamic = 'force-dynamic';

type Locale = 'ja' | 'zh' | 'en';

const REGION_LABEL: Record<Region, Record<Locale, string>> = {
  SHONAN: {ja: '湘南', zh: '湘南', en: 'Shonan'},
  CHIBA: {ja: '千葉', zh: '千叶', en: 'Chiba'},
  SHIZUOKA: {ja: '静岡', zh: '静冈', en: 'Shizuoka'},
  MIYAZAKI: {ja: '宮崎', zh: '宫崎', en: 'Miyazaki'}
};

const UI = {
  title: {ja: '今日のポイント', zh: '今日浪点', en: "Today's Spots"},
  subtitle: {
    ja: '実時間データ · Open-Meteo Marine',
    zh: '实时数据 · 来源 Open-Meteo Marine',
    en: 'Live data from Open-Meteo Marine'
  },
  boardTypes: {ja: '板の種類', zh: '板型', en: 'Boards'},
  train: {ja: '電車で行ける', zh: '电车可达', en: 'Train accessible'},
  beginner: {ja: '初心者向け', zh: '新手友好', en: 'Beginner-friendly'},
  wave: {ja: '波高', zh: '浪高', en: 'Wave'},
  period: {ja: '周期', zh: '周期', en: 'Period'},
  wind: {ja: '風', zh: '风', en: 'Wind'},
  temp: {ja: '気温', zh: '气温', en: 'Air'},
  noData: {ja: '予報データなし', zh: '暂无预报', en: 'No forecast'},
  updated: {ja: '更新', zh: '更新', en: 'Updated'}
} as const;

function spotName(spot: Spot, locale: Locale): string {
  if (locale === 'ja') return spot.nameJa;
  if (locale === 'zh') return spot.nameZh ?? spot.nameJa;
  return spot.nameEn;
}

function spotDesc(spot: Spot, locale: Locale): string | null {
  if (locale === 'ja') return spot.descJa;
  if (locale === 'zh') return spot.descZh;
  return spot.descEn;
}

function formatTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(
    locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US',
    {hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo'}
  );
}

export default async function SpotsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const spots = await prisma.spot.findMany({
    orderBy: [{region: 'asc'}, {slug: 'asc'}]
  });

  const forecasts = await Promise.all(
    spots.map((s) => fetchForecast(s.latitude, s.longitude))
  );
  const spotForecast = new Map<number, Forecast | null>(
    spots.map((s, i) => [s.id, forecasts[i]])
  );

  const byRegion = spots.reduce<Record<Region, Spot[]>>((acc, spot) => {
    (acc[spot.region] ||= []).push(spot);
    return acc;
  }, {} as Record<Region, Spot[]>);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-light tracking-widest">{UI.title[lc]}</h1>
        <p className="mt-3 text-sm text-zinc-400">{UI.subtitle[lc]}</p>
      </header>

      {(Object.keys(byRegion) as Region[]).map((region) => (
        <section key={region} className="mb-14">
          <h2 className="mb-5 border-b border-zinc-800 pb-2 text-xl tracking-wider text-zinc-300">
            {REGION_LABEL[region][lc]}
            <span className="ml-3 text-sm text-zinc-500">
              {byRegion[region].length}
            </span>
          </h2>

          <ul className="grid gap-4 sm:grid-cols-2">
            {byRegion[region].map((spot) => {
              const f = spotForecast.get(spot.id) ?? null;
              return (
                <li
                  key={spot.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
                >
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-lg font-medium text-zinc-100">
                      {spotName(spot, lc)}
                    </h3>
                    <span className="text-xs text-zinc-500">{spot.nameEn}</span>
                  </div>

                  {spotDesc(spot, lc) && (
                    <p className="mb-3 text-sm leading-relaxed text-zinc-400">
                      {spotDesc(spot, lc)}
                    </p>
                  )}

                  <div className="mb-3 flex flex-wrap gap-2">
                    {spot.trainAccessible && (
                      <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-300">
                        {UI.train[lc]}
                      </span>
                    )}
                    {spot.beginnerFriendly && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                        {UI.beginner[lc]}
                      </span>
                    )}
                    {spot.boardTypes.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {f ? (
                    <div className="rounded-lg border border-zinc-800 bg-black/30 p-3">
                      <dl className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
                            {UI.wave[lc]}
                          </dt>
                          <dd className="text-lg font-medium text-sky-300">
                            {f.waveHeight != null
                              ? `${f.waveHeight.toFixed(1)}m`
                              : '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
                            {UI.period[lc]}
                          </dt>
                          <dd className="text-lg font-medium text-zinc-200">
                            {f.wavePeriod != null
                              ? `${f.wavePeriod.toFixed(0)}s`
                              : '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
                            {UI.wind[lc]}
                          </dt>
                          <dd className="text-lg font-medium text-zinc-200">
                            {f.windSpeed != null
                              ? `${f.windSpeed.toFixed(1)}`
                              : '—'}
                            {f.windDirection != null && (
                              <span className="ml-1 text-xs text-zinc-500">
                                {compassPoint(f.windDirection)}
                              </span>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
                            {UI.temp[lc]}
                          </dt>
                          <dd className="text-lg font-medium text-zinc-200">
                            {f.temperature != null
                              ? `${f.temperature.toFixed(0)}°`
                              : '—'}
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-2 text-right text-[10px] text-zinc-600">
                        {UI.updated[lc]} {formatTime(f.observedAt, lc)} JST
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-zinc-800 bg-black/30 p-3 text-center text-sm text-zinc-500">
                      {UI.noData[lc]}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {spots.length === 0 && (
        <p className="text-center text-zinc-500">
          {lc === 'ja'
            ? 'データベースにポイントがありません。'
            : lc === 'zh'
              ? '数据库中还没有浪点。'
              : 'No spots in the database yet.'}
        </p>
      )}
    </main>
  );
}
