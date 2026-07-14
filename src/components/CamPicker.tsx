'use client';

import {useState} from 'react';
import {LiveCamEmbed} from './LiveCamEmbed';

type Locale = 'ja' | 'zh' | 'en';

export type CamData = {
  id: number;
  nameJa: string;
  nameEn: string;
  nameZh: string | null;
  youtubeVideoId: string | null;
  youtubeChannelId: string | null;
};

const T = {
  live: {ja: 'LIVE', zh: 'LIVE', en: 'LIVE'},
  offline: {ja: 'オフライン', zh: '离线', en: 'Offline'},
  noCams: {
    ja: 'このポイントのライブカメラは未登録です。',
    zh: '此浪点尚未登记直播摄像头。',
    en: 'No live cams for this spot yet.'
  }
} as const;

function camName(cam: CamData, locale: Locale): string {
  if (locale === 'ja') return cam.nameJa;
  if (locale === 'zh') return cam.nameZh ?? cam.nameJa;
  return cam.nameEn;
}

function isLive(cam: CamData): boolean {
  return !!(cam.youtubeVideoId || cam.youtubeChannelId);
}

export function CamPicker({
  cams,
  locale
}: {
  cams: CamData[];
  locale: Locale;
}) {
  const [selectedId, setSelectedId] = useState(cams[0]?.id ?? -1);

  if (cams.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-line bg-white text-center text-xs text-grey-brand">
        <span className="px-6">{T.noCams[locale]}</span>
      </div>
    );
  }

  const current = cams.find((c) => c.id === selectedId) ?? cams[0];
  const currentLive = isLive(current);
  const showTabs = cams.length > 1;

  return (
    <div className="flex gap-2">
      {/* Video card — flex-1 so it fills whatever cam column gives it */}
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line bg-sky-brand px-3 py-1.5 text-xs">
          <span className="truncate font-medium text-ocean">
            📹 {camName(current, locale)}
          </span>
          {currentLive ? (
            <span className="ml-2 flex items-center gap-1.5 rounded-full bg-red-brand/90 px-2 py-0.5 text-[10px] font-bold text-white">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {T.live[locale]}
            </span>
          ) : (
            <span className="ml-2 rounded-full bg-grey-brand/20 px-2 py-0.5 text-[10px] font-semibold text-grey-brand">
              {T.offline[locale]}
            </span>
          )}
        </div>
        <div className="aspect-video bg-navy">
          <LiveCamEmbed
            cam={{
              nameJa: current.nameJa,
              nameEn: current.nameEn,
              nameZh: current.nameZh,
              youtubeVideoId: current.youtubeVideoId,
              youtubeChannelId: current.youtubeChannelId
            }}
            locale={locale}
            hideHeader
          />
        </div>
      </div>

      {/* Vertical camera-position tabs on the right */}
      {showTabs && (
        <div className="flex w-[104px] shrink-0 flex-col gap-1.5">
          {cams.map((c) => {
            const isActive = c.id === current.id;
            const camLive = isLive(c);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={
                  (isActive
                    ? 'border-ocean bg-sky-brand '
                    : 'border-line bg-white hover:border-ocean/50 ') +
                  'flex flex-col items-start gap-1 rounded-lg border-[1.5px] px-2.5 py-2 text-left transition-colors'
                }
              >
                <span
                  className={
                    (isActive ? 'font-semibold text-ocean ' : 'text-ink ') +
                    'text-[11.5px] leading-tight'
                  }
                >
                  {camName(c, locale)}
                </span>
                <span
                  className={
                    (camLive
                      ? 'bg-red-brand/90 text-white '
                      : 'bg-grey-brand/20 text-grey-brand ') +
                    'rounded-full px-1.5 text-[9px] font-bold'
                  }
                >
                  {camLive ? T.live[locale] : T.offline[locale]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
