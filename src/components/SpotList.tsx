'use client';

import type {Spot, Region} from '@prisma/client';
import {useState} from 'react';
import type {Forecast, HourlyForecast} from '@/lib/openMeteo';
import type {Window} from '@/lib/bestWindow';
import {SpotRow} from './SpotRow';
import type {CamData} from './CamPicker';

type Locale = 'ja' | 'zh' | 'en';

type Row = {
  spot: Spot;
  forecast: Forecast | null;
  hourly: HourlyForecast | null;
  interpretation: string | null;
  bestWindow: Window | null;
  cams: CamData[];
};

const REGION_ORDER: (Region | 'ALL')[] = [
  'SHONAN',
  'CHIBA',
  'SHIZUOKA',
  'MIYAZAKI',
  'WORLD',
  'ALL'
];

const LABEL: Record<Region | 'ALL', Record<Locale, string>> = {
  SHONAN: {ja: '湘南', zh: '湘南', en: 'Shonan'},
  CHIBA: {ja: '千葉', zh: '千叶', en: 'Chiba'},
  SHIZUOKA: {ja: '静岡', zh: '静冈', en: 'Shizuoka'},
  MIYAZAKI: {ja: '宮崎', zh: '宫崎', en: 'Miyazaki'},
  WORLD: {ja: '名波', zh: '世界名浪', en: 'Iconic Waves'},
  ALL: {ja: 'すべて', zh: '全部', en: 'All'}
};

export function SpotList({
  rows,
  locale
}: {
  rows: Row[];
  locale: Locale;
}) {
  const [active, setActive] = useState<Region | 'ALL'>('SHONAN');

  const counts: Record<Region | 'ALL', number> = {
    SHONAN: 0,
    CHIBA: 0,
    SHIZUOKA: 0,
    MIYAZAKI: 0,
    WORLD: 0,
    ALL: rows.length
  };
  for (const r of rows) counts[r.spot.region]++;

  const filtered =
    active === 'ALL' ? rows : rows.filter((r) => r.spot.region === active);

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {REGION_ORDER.map((r) => {
          const isActive = r === active;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setActive(r)}
              className={
                (isActive
                  ? 'bg-navy border-navy text-white font-semibold '
                  : 'bg-white border-line text-muted ') +
                'rounded-full border-[1.5px] px-4 py-1.5 text-sm transition-colors'
              }
            >
              {LABEL[r][locale]}
              <span className="ml-1 text-xs opacity-70">{counts[r]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3.5">
        {filtered.map((r) => (
          <SpotRow
            key={r.spot.id}
            spot={r.spot}
            forecast={r.forecast}
            hourly={r.hourly}
            interpretation={r.interpretation}
            bestWindow={r.bestWindow}
            cams={r.cams}
            locale={locale}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
            —
          </div>
        )}
      </div>
    </>
  );
}
