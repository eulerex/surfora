'use client';

import Link from 'next/link';
import {useState} from 'react';
import type {Spot, Region} from '@prisma/client';
import type {Forecast} from '@/lib/openMeteo';
import {compassPoint} from '@/lib/openMeteo';
import {scoreOf} from '@/lib/score';
import {formatWindow, type Window} from '@/lib/bestWindow';

type Locale = 'ja' | 'zh' | 'en';

const REGION_LABEL: Record<Region, Record<Locale, string>> = {
  SHONAN: {ja: '湘南', zh: '湘南', en: 'Shonan'},
  CHIBA: {ja: '千葉', zh: '千叶', en: 'Chiba'},
  SHIZUOKA: {ja: '静岡', zh: '静冈', en: 'Shizuoka'},
  MIYAZAKI: {ja: '宮崎', zh: '宫崎', en: 'Miyazaki'},
  WORLD: {ja: '名波', zh: '世界名浪', en: 'Iconic Waves'}
};

const T = {
  score: {ja: '/100 推薦度', zh: '/100 推荐度', en: '/100 rating'},
  train: {ja: '電車で行ける', zh: '电车可达', en: 'Train'},
  car: {ja: '車必要', zh: '需开车', en: 'Car'},
  beginner: {ja: '初心者向け', zh: '新手友好', en: 'Beginner'},
  avoid: {ja: '今日は避けたい', zh: '今日避开', en: 'Skip today'},
  bestTime: {ja: '最適時間', zh: '最佳时间', en: 'Best window'},
  boards: {ja: '板の種類', zh: '板型', en: 'Boards'},
  wave: {ja: '波高', zh: '浪高', en: 'Wave'},
  wind: {ja: '風', zh: '风', en: 'Wind'},
  water: {ja: '水温', zh: '水温', en: 'Water'},
  noForecast: {ja: '予報なし', zh: '暂无预报', en: 'No forecast'},
  detail: {ja: '詳細を見る', zh: '看详情', en: 'Details'},
  optimalSwell: {ja: '最適スウェル向き', zh: '最优浪向', en: 'Best swell'},
  offshoreWind: {ja: '離岸風向', zh: '离岸风向', en: 'Offshore wind'},
  windDir: {ja: '風向', zh: '风向', en: 'Wind dir'},
  temp: {ja: '気温', zh: '气温', en: 'Air'},
  coords: {ja: '座標', zh: '坐标', en: 'Coords'}
} as const;

function spotName(spot: Spot, locale: Locale): string {
  if (locale === 'ja') return spot.nameJa;
  if (locale === 'zh') return spot.nameZh ?? spot.nameJa;
  return spot.nameEn;
}

function spotLocation(spot: Spot, locale: Locale): string | null {
  if (locale === 'ja') return spot.locationJa;
  if (locale === 'zh') return spot.locationZh;
  return spot.locationEn;
}

function spotDesc(spot: Spot, locale: Locale): string | null {
  if (locale === 'ja') return spot.descJa;
  if (locale === 'zh') return spot.descZh;
  return spot.descEn;
}

export function SpotCard({
  spot,
  forecast,
  interpretation,
  bestWindow,
  locale
}: {
  spot: Spot;
  forecast: Forecast | null;
  interpretation: string | null;
  bestWindow: Window | null;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const score = scoreOf(forecast);
  const scoreColor =
    score >= 70
      ? 'text-green-brand'
      : score >= 50
        ? 'text-yellow-brand'
        : 'text-red-brand';

  const isBad = score > 0 && score < 40;
  const desc = spotDesc(spot, locale);

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={`/${locale}/spots/${spot.slug}`}
        className="flex h-full flex-col rounded-2xl border-[1.5px] border-line bg-white p-4 transition-shadow hover:border-ocean/40 hover:shadow-md"
      >
        <div className="mb-2.5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[17px] font-bold leading-tight">
              {spotName(spot, locale)}
              <span className="ml-1.5 text-xs font-normal text-muted">
                {spot.nameEn} ·{' '}
                {spotLocation(spot, locale) ??
                  REGION_LABEL[spot.region][locale]}
              </span>
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {spot.trainAccessible ? (
                <span className="rounded-full bg-sky-brand px-2 py-0.5 text-[11px] text-ocean">
                  {T.train[locale]}
                </span>
              ) : (
                <span className="rounded-full bg-sky-brand/60 px-2 py-0.5 text-[11px] text-ocean">
                  {T.car[locale]}
                </span>
              )}
              {spot.beginnerFriendly && (
                <span className="rounded-full bg-[#eef8f1] px-2 py-0.5 text-[11px] text-green-brand">
                  {T.beginner[locale]}
                </span>
              )}
              {isBad && (
                <span className="rounded-full bg-[#fdeaea] px-2 py-0.5 text-[11px] text-red-brand">
                  {T.avoid[locale]}
                </span>
              )}
            </div>
          </div>
          {forecast && (
            <div className="min-w-[68px] shrink-0 text-center">
              <div
                className={`text-[26px] font-extrabold leading-none ${scoreColor}`}
              >
                {score}
              </div>
              <div className="mt-0.5 text-[10px] text-muted">
                {T.score[locale]}
              </div>
            </div>
          )}
        </div>

        {interpretation && (
          <div
            className={
              (isBad ? 'bg-[#fdeaea] ' : 'bg-sky-brand ') +
              'my-2 rounded-lg px-3 py-2 text-[13px] text-navy'
            }
          >
            {interpretation}
          </div>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-x-3.5 gap-y-1 text-[13px]">
          <KV
            k={T.bestTime[locale]}
            v={bestWindow ? formatWindow(bestWindow) : '—'}
            highlight={!!bestWindow}
          />
          <KV k={T.boards[locale]} v={spot.boardTypes.join(' / ') || '—'} />
          <KV
            k={T.wave[locale]}
            v={
              forecast?.waveHeight != null
                ? `${forecast.waveHeight.toFixed(1)}m · ${forecast.wavePeriod?.toFixed(0) ?? '—'}s`
                : T.noForecast[locale]
            }
          />
          <KV
            k={T.wind[locale]}
            v={
              forecast?.windSpeed != null
                ? `${forecast.windSpeed.toFixed(1)} m/s`
                : '—'
            }
          />
          {forecast?.seaTemp != null && (
            <KV k={T.water[locale]} v={`${forecast.seaTemp.toFixed(1)}°C`} />
          )}
          {forecast?.temperature != null && (
            <KV k={T.temp[locale]} v={`${forecast.temperature.toFixed(0)}°C`} />
          )}
        </dl>

        <div className="mt-auto flex items-center justify-between border-t border-dashed border-line pt-2.5">
          <span className="text-[13px] font-semibold text-ocean">
            {T.detail[locale]} →
          </span>
        </div>
      </Link>

      {open && (
        <div className="animate-drop pointer-events-none absolute inset-x-0 top-full z-30 mt-1.5 rounded-xl border-[1.5px] border-ocean bg-white p-4 shadow-2xl shadow-navy/20">
          {desc && (
            <p className="mb-3 text-[13px] leading-relaxed text-ink">{desc}</p>
          )}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12.5px]">
            {spot.optimalSwellDir && (
              <KV k={T.optimalSwell[locale]} v={spot.optimalSwellDir} />
            )}
            {spot.offshoreWindDir && (
              <KV k={T.offshoreWind[locale]} v={spot.offshoreWindDir} />
            )}
            {forecast?.windDirection != null && (
              <KV
                k={T.windDir[locale]}
                v={compassPoint(forecast.windDirection) ?? '—'}
              />
            )}
            {forecast?.temperature != null && (
              <KV
                k={T.temp[locale]}
                v={`${forecast.temperature.toFixed(0)}°C`}
              />
            )}
            <KV
              k={T.coords[locale]}
              v={`${spot.latitude.toFixed(2)}, ${spot.longitude.toFixed(2)}`}
            />
          </dl>
        </div>
      )}
    </div>
  );
}

function KV({k, v, highlight}: {k: string; v: string; highlight?: boolean}) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-line py-0.5">
      <span className="text-muted">{k}</span>
      <span className={highlight ? 'font-semibold text-green-brand' : 'text-ink'}>
        {v}
      </span>
    </div>
  );
}
