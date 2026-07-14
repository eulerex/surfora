'use client';

type Locale = 'ja' | 'zh' | 'en';
export type SpotView = 'info' | 'forecast' | 'trend';

const T = {
  info: {ja: '情報', zh: '信息', en: 'Info'},
  forecast: {ja: '予報', zh: '预报', en: 'Forecast'},
  trend: {ja: 'グラフ', zh: '走势', en: 'Trend'}
} as const;

const BUTTONS: {view: SpotView; icon: string}[] = [
  {view: 'info', icon: '🏄'},
  {view: 'forecast', icon: '📊'},
  {view: 'trend', icon: '📈'}
];

export function SpotRail({
  active,
  onChange,
  locale
}: {
  active: SpotView;
  onChange: (v: SpotView) => void;
  locale: Locale;
}) {
  return (
    <div className="flex flex-row gap-2 md:flex-col">
      {BUTTONS.map(({view, icon}) => {
        const isActive = view === active;
        return (
          <button
            key={view}
            type="button"
            onClick={() => onChange(view)}
            className={
              (isActive
                ? 'bg-ocean border-ocean text-white '
                : 'bg-white border-line text-muted hover:border-ocean hover:text-ocean ') +
              'flex w-full flex-col items-center gap-0.5 rounded-xl border-[1.5px] py-2.5 text-[11px] font-semibold transition-colors md:w-[54px]'
            }
          >
            <span className="text-[15px] leading-none">{icon}</span>
            {T[view][locale]}
          </button>
        );
      })}
    </div>
  );
}
