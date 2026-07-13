'use client';

import {useState} from 'react';
import Link from 'next/link';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  barTitle: {
    ja: '今日、湘南のどこで乗る？',
    zh: '今天湘南哪里适合冲浪？',
    en: 'Where to surf in Shonan today?'
  },
  expand: {ja: ' ▾ 総覧を開く', zh: ' ▾ 展开总览', en: ' ▾ Open overview'},
  collapse: {ja: ' ▴ 閉じる', zh: ' ▴ 收起', en: ' ▴ Close'},
  tagline: {
    ja: 'AI Surf Forecast for Japan · 今日の判断をひと目で。',
    zh: 'AI Surf Forecast for Japan · 一眼看清今日该去哪里。',
    en: 'AI Surf Forecast for Japan · today\'s call at a glance.'
  },
  cta1: {ja: 'ポイントを見る', zh: '查看浪点', en: 'See spots'},
  cta2: {ja: '他エリア', zh: '切换地区', en: 'Other regions'},
  bestLocal: {ja: '湘南ベスト', zh: '湘南最佳', en: 'Shonan pick'},
  bestNational: {ja: '全国ベスト', zh: '全国最佳', en: 'National pick'},
  avoid: {ja: '避けたい', zh: '避开', en: 'Skip'},
  score: {ja: '点', zh: '分', en: 'pts'}
} as const;

export type HeroChip = {
  kind: 'good-local' | 'good-national' | 'bad';
  name: string;
  detail?: string;
  score?: number;
};

export function Hero({
  locale,
  chips
}: {
  locale: Locale;
  chips: HeroChip[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={
        'sticky top-14 z-40 cursor-pointer bg-gradient-to-br from-[#0b2239] to-[#0e4d7a] px-5 py-3 text-center text-white'
      }
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, a')) return;
        setOpen((v) => !v);
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="text-[15px] font-bold">
        {T.barTitle[locale]}
        <span className="ml-2 text-xs font-normal opacity-70">
          {open ? T.collapse[locale] : T.expand[locale]}
        </span>
      </div>

      {open && (
        <div
          className="absolute inset-x-0 top-full cursor-default bg-gradient-to-br from-[#0e3a5e] to-[#0e6ba8] px-5 pb-9 pt-9 shadow-2xl shadow-[#0b2239]/45"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="mb-2 text-3xl font-extrabold tracking-wide">Surfora</h1>
          <p className="mb-5 text-[15px] opacity-85">{T.tagline[locale]}</p>
          <div className="mb-7 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}#spots`}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-ocean"
            >
              {T.cta1[locale]}
            </Link>
            <Link
              href={`/${locale}#map`}
              className="rounded-lg border-[1.5px] border-white/60 bg-transparent px-5 py-2.5 text-sm font-semibold text-white"
            >
              {T.cta2[locale]}
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-3.5">
            {chips.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm"
              >
                <Dot kind={c.kind} />
                <span className="opacity-90">
                  {c.kind === 'good-local'
                    ? T.bestLocal[locale]
                    : c.kind === 'good-national'
                      ? T.bestNational[locale]
                      : T.avoid[locale]}
                </span>
                <span>：</span>
                <b className="font-semibold">{c.name}</b>
                {c.score != null && (
                  <span className="font-semibold">
                    {c.score}
                    {T.score[locale]}
                  </span>
                )}
                {c.detail && (
                  <span className="text-xs opacity-75">· {c.detail}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Dot({kind}: {kind: HeroChip['kind']}) {
  const bg =
    kind === 'good-local' || kind === 'good-national'
      ? '#3ddc97'
      : '#ff7b7b';
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{background: bg}}
    />
  );
}
