'use client';

import {useEffect, useRef, useState} from 'react';
import type {Spot} from '@prisma/client';
import type {HourlyForecast} from '@/lib/openMeteo';

type Locale = 'ja' | 'zh' | 'en';
type ChartType = 'waves' | 'energy' | 'tide';

const T = {
  waves: {ja: '波高·風速', zh: '浪高·风速', en: 'Waves · wind'},
  energy: {ja: 'エネルギー', zh: '能量', en: 'Energy'},
  tide: {ja: '潮汐', zh: '潮汐', en: 'Tide'},
  waveHeight: {ja: '波高 m', zh: '浪高 m', en: 'Wave m'},
  period: {ja: '周期 s', zh: '周期 s', en: 'Period s'},
  windSpeed: {ja: '風速 m/s', zh: '风速 m/s', en: 'Wind m/s'},
  energyLabel: {ja: 'エネルギー指数', zh: '能量指数', en: 'Energy index'},
  tideLabel: {ja: '潮位 cm', zh: '潮位 cm', en: 'Tide cm'},
  tideNote: {
    ja: '潮位は近似値です（正式版で気象庁に接続予定）',
    zh: '潮位为近似值（正式版接气象厅）',
    en: 'Tide approximated (JMA data pending)'
  },
  noData: {
    ja: '予報データがありません',
    zh: '暂无预报数据',
    en: 'No forecast data'
  }
} as const;

function spotName(spot: Spot, locale: Locale): string {
  if (locale === 'ja') return spot.nameJa;
  if (locale === 'zh') return spot.nameZh ?? spot.nameJa;
  return spot.nameEn;
}

/**
 * Approximate tide from a simple 12.4h sinusoid pinned to a mid-day peak.
 * Placeholder until we connect JMA tide tables.
 */
function approximateTide(hourly: HourlyForecast): number[] {
  const peakHour = 7;
  return hourly.time.map((_, i) => {
    return Math.round(95 + 70 * Math.cos(((i - peakHour) / 12.4) * Math.PI * 2));
  });
}

export function SpotTrendChart({
  spot,
  hourly,
  locale
}: {
  spot: Spot;
  hourly: HourlyForecast | null;
  locale: Locale;
}) {
  const [chartType, setChartType] = useState<ChartType>('waves');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !hourly) return;
    let cancelled = false;

    (async () => {
      const {Chart, registerables} = await import('chart.js/auto');
      // register once — Chart.js's `auto` import auto-registers, so this is a no-op typically
      void Chart;
      void registerables;
      if (cancelled || !canvasRef.current) return;

      chartRef.current?.destroy();

      const labels = hourly.time.map((t) => t.slice(11, 16));
      const commonScales = {
        x: {
          ticks: {maxTicksLimit: 12, font: {size: 10}},
          grid: {display: false}
        }
      };

      let cfg: object;
      if (chartType === 'waves') {
        cfg = {
          data: {
            labels,
            datasets: [
              {
                type: 'bar' as const,
                label: T.waveHeight[locale],
                data: hourly.waveHeight,
                backgroundColor: 'rgba(14,107,168,0.55)',
                yAxisID: 'y',
                order: 3,
                borderRadius: 3
              },
              {
                type: 'line' as const,
                label: T.period[locale],
                data: hourly.wavePeriod,
                borderColor: '#1a9e6e',
                yAxisID: 'y2',
                tension: 0.35,
                pointRadius: 0,
                borderWidth: 2,
                order: 1
              },
              {
                type: 'line' as const,
                label: T.windSpeed[locale],
                data: hourly.windSpeed,
                borderColor: '#e0a400',
                yAxisID: 'y2',
                tension: 0.35,
                pointRadius: 0,
                borderWidth: 2,
                borderDash: [5, 4],
                order: 2
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            interaction: {mode: 'index' as const, intersect: false},
            plugins: {legend: {labels: {boxWidth: 14, font: {size: 11}}}},
            scales: {
              y: {suggestedMax: 2, grid: {color: '#eef3f7'}},
              y2: {
                position: 'right' as const,
                grid: {display: false}
              },
              ...commonScales
            }
          }
        };
      } else if (chartType === 'energy') {
        const energies = hourly.time.map((_, i) => {
          const w = hourly.waveHeight[i] ?? 0;
          const p = hourly.wavePeriod[i] ?? 0;
          return +(w * w * p).toFixed(2);
        });
        cfg = {
          type: 'line' as const,
          data: {
            labels,
            datasets: [
              {
                label: T.energyLabel[locale],
                data: energies,
                fill: true,
                tension: 0.35,
                pointRadius: 0,
                borderWidth: 2,
                borderColor: '#0e6ba8',
                backgroundColor: 'rgba(14,107,168,0.15)'
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {legend: {display: false}},
            scales: {y: {grid: {color: '#eef3f7'}}, ...commonScales}
          }
        };
      } else {
        const tide = approximateTide(hourly);
        cfg = {
          type: 'line' as const,
          data: {
            labels,
            datasets: [
              {
                label: T.tideLabel[locale],
                data: tide,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                borderColor: '#1a9e6e',
                backgroundColor: 'rgba(26,158,110,0.15)'
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            plugins: {legend: {display: false}},
            scales: {y: {grid: {color: '#eef3f7'}}, ...commonScales}
          }
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chartRef.current = new (Chart as any)(canvasRef.current, cfg);
    })();

    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartType, hourly, locale]);

  if (!hourly) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border-[1.5px] border-line bg-white p-6 text-sm text-muted">
        {T.noData[locale]}
      </div>
    );
  }

  const tabs: {key: ChartType; label: string}[] = [
    {key: 'waves', label: T.waves[locale]},
    {key: 'energy', label: T.energy[locale]},
    {key: 'tide', label: T.tide[locale]}
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border-[1.5px] border-line bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div className="text-[13px] font-bold">{spotName(spot, locale)}</div>
        <div className="flex gap-1.5">
          {tabs.map(({key, label}) => {
            const isActive = key === chartType;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setChartType(key)}
                className={
                  (isActive
                    ? 'bg-ocean text-white border-ocean '
                    : 'bg-white text-muted border-line hover:border-ocean hover:text-ocean ') +
                  'rounded-full border-[1.5px] px-2.5 py-0.5 text-[11px] font-semibold transition-colors'
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative flex-1 min-h-[200px]">
        <canvas ref={canvasRef} />
      </div>
      {chartType === 'tide' && (
        <p className="mt-2 text-[10px] text-grey-brand">{T.tideNote[locale]}</p>
      )}
    </div>
  );
}
