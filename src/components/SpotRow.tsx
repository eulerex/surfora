'use client';

import {useState} from 'react';
import type {Spot} from '@prisma/client';
import type {Forecast, HourlyForecast} from '@/lib/openMeteo';
import type {Window} from '@/lib/bestWindow';
import {SpotCard} from './SpotCard';
import {SpotRail, type SpotView} from './SpotRail';
import {SpotForecastTable} from './SpotForecastTable';
import {SpotTrendChart} from './SpotTrendChart';
import {CamPicker, type CamData} from './CamPicker';

type Locale = 'ja' | 'zh' | 'en';

export function SpotRow({
  spot,
  forecast,
  hourly,
  interpretation,
  bestWindow,
  cams,
  locale
}: {
  spot: Spot;
  forecast: Forecast | null;
  hourly: HourlyForecast | null;
  interpretation: string | null;
  bestWindow: Window | null;
  cams: CamData[];
  locale: Locale;
}) {
  const [view, setView] = useState<SpotView>('info');

  return (
    <div className="grid gap-3 md:grid-cols-[54px_1fr_1fr] md:items-stretch">
      <SpotRail active={view} onChange={setView} locale={locale} />
      <div className="min-w-0">
        {view === 'info' && (
          <SpotCard
            spot={spot}
            forecast={forecast}
            interpretation={interpretation}
            bestWindow={bestWindow}
            locale={locale}
          />
        )}
        {view === 'forecast' && (
          <SpotForecastTable spot={spot} hourly={hourly} locale={locale} />
        )}
        {view === 'trend' && (
          <SpotTrendChart spot={spot} hourly={hourly} locale={locale} />
        )}
      </div>
      <CamPicker cams={cams} locale={locale} />
    </div>
  );
}
