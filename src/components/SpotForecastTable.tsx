import type {Spot} from '@prisma/client';
import type {HourlyForecast} from '@/lib/openMeteo';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  title: {ja: '3時間予報', zh: '逐 3 小时预报', en: '3-hour forecast'},
  today: {ja: '今日', zh: '今天', en: 'today'},
  hour: {ja: '時刻', zh: '时刻', en: 'Hour'},
  wave: {ja: '波高 m', zh: '浪高 m', en: 'Wave m'},
  period: {ja: '周期 s', zh: '周期 s', en: 'Period s'},
  energy: {ja: 'エネルギー', zh: '能量', en: 'Energy'},
  wind: {ja: '風 m/s', zh: '风 m/s', en: 'Wind m/s'},
  water: {ja: '水温', zh: '水温', en: 'Water'},
  air: {ja: '気温', zh: '气温', en: 'Air'},
  noData: {
    ja: '予報データがありません',
    zh: '暂无预报数据',
    en: 'No forecast data'
  },
  source: {
    ja: 'データ: Open-Meteo Marine',
    zh: '数据来源: Open-Meteo Marine',
    en: 'Data: Open-Meteo Marine'
  }
} as const;

function windCellColor(v: number | null): string {
  if (v == null) return '';
  if (v < 4) return 'bg-[#e3f5ec]';
  if (v < 7) return 'bg-[#fdf3d7]';
  return 'bg-[#fdeaea]';
}

function spotName(spot: Spot, locale: Locale): string {
  if (locale === 'ja') return spot.nameJa;
  if (locale === 'zh') return spot.nameZh ?? spot.nameJa;
  return spot.nameEn;
}

export function SpotForecastTable({
  spot,
  hourly,
  locale
}: {
  spot: Spot;
  hourly: HourlyForecast | null;
  locale: Locale;
}) {
  if (!hourly) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border-[1.5px] border-line bg-white p-6 text-sm text-muted">
        {T.noData[locale]}
      </div>
    );
  }

  const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];
  const energies = hourly.time.map((_, i) => {
    const w = hourly.waveHeight[i] ?? 0;
    const p = hourly.wavePeriod[i] ?? 0;
    return w * w * p;
  });
  const maxEnergy = Math.max(...energies, 1);

  return (
    <div className="flex h-full flex-col rounded-2xl border-[1.5px] border-line bg-white p-4">
      <div className="mb-3 text-[13px] font-bold">
        {spotName(spot, locale)} · {T.title[locale]}
        <span className="ml-1.5 text-xs font-normal text-muted">
          {T.today[locale]}
        </span>
      </div>
      <table className="w-full flex-1 border-collapse text-[11.5px]">
        <thead>
          <tr>
            <th className="whitespace-nowrap pr-1.5 text-left font-semibold text-muted">
              {T.hour[locale]}
            </th>
            {HOURS.map((h) => (
              <th
                key={h}
                className="border-b border-dashed border-line px-1 py-1 text-center font-semibold text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="whitespace-nowrap pr-1.5 py-1 text-left font-semibold text-muted">
              {T.wave[locale]}
            </th>
            {HOURS.map((h) => (
              <td
                key={h}
                className="border-b border-dashed border-line px-1 py-1 text-center"
              >
                <b>{hourly.waveHeight[h]?.toFixed(1) ?? '—'}</b>
              </td>
            ))}
          </tr>
          <tr>
            <th className="whitespace-nowrap pr-1.5 py-1 text-left font-semibold text-muted">
              {T.period[locale]}
            </th>
            {HOURS.map((h) => (
              <td
                key={h}
                className="border-b border-dashed border-line px-1 py-1 text-center"
              >
                {hourly.wavePeriod[h]?.toFixed(1) ?? '—'}
              </td>
            ))}
          </tr>
          <tr>
            <th className="whitespace-nowrap pr-1.5 py-1 text-left font-semibold text-muted">
              {T.energy[locale]}
            </th>
            {HOURS.map((h) => {
              const v = energies[h];
              const r = v / maxEnergy;
              const bg = `rgba(14,107,168,${(r * 0.85).toFixed(2)})`;
              const color = r > 0.55 ? '#fff' : 'inherit';
              return (
                <td
                  key={h}
                  className="border-b border-dashed border-line px-1 py-1 text-center"
                  style={{background: bg, color}}
                >
                  {Math.round(v * 10)}
                </td>
              );
            })}
          </tr>
          <tr>
            <th className="whitespace-nowrap pr-1.5 py-1 text-left font-semibold text-muted">
              {T.wind[locale]}
            </th>
            {HOURS.map((h) => {
              const v = hourly.windSpeed[h] ?? null;
              return (
                <td
                  key={h}
                  className={
                    'border-b border-dashed border-line px-1 py-1 text-center ' +
                    windCellColor(v)
                  }
                >
                  {v?.toFixed(1) ?? '—'}
                </td>
              );
            })}
          </tr>
          <tr>
            <th className="whitespace-nowrap pr-1.5 py-1 text-left font-semibold text-muted">
              {T.water[locale]}
            </th>
            {HOURS.map((h) => (
              <td
                key={h}
                className="border-b border-dashed border-line px-1 py-1 text-center"
              >
                {hourly.seaTemp[h]?.toFixed(1) ?? '—'}
              </td>
            ))}
          </tr>
          <tr>
            <th className="whitespace-nowrap pr-1.5 py-1 text-left font-semibold text-muted">
              {T.air[locale]}
            </th>
            {HOURS.map((h) => (
              <td key={h} className="px-1 py-1 text-center">
                {hourly.temperature[h]?.toFixed(0) ?? '—'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-grey-brand">{T.source[locale]}</p>
    </div>
  );
}
