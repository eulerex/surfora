import type {Region, Spot, Cam} from '@prisma/client';
import {setRequestLocale} from 'next-intl/server';
import {prisma} from '@/lib/prisma';
import {fetchHourly, type Forecast} from '@/lib/openMeteo';
import {bestWindow} from '@/lib/bestWindow';
import {interpretSpot} from '@/lib/interpretSpot';
import {Hero, type HeroChip} from '@/components/Hero';
import {SpotList} from '@/components/SpotList';
import {scoreOf} from '@/lib/score';

export const dynamic = 'force-dynamic';

type Locale = 'ja' | 'zh' | 'en';

const H = {
  spotsTitle: {ja: '今日のポイント', zh: '今日浪点', en: "Today's spots"},
  spotsSub: {
    ja: '既定は湘南。地域タブで切り替え。カードにマウスを乗せると詳細が浮上。',
    zh: '默认湘南，用地区标签切换。鼠标停在卡片上看详情。',
    en: 'Shonan by default. Switch region via tabs. Hover a card for details.'
  },
  trend: {ja: '今日の走勢', zh: '今日走势', en: "Today's trend"},
  trendSub: {
    ja: '波高 / エネルギー / 潮汐のグラフ（近日追加）',
    zh: '浪高 / 能量 / 潮汐图表（即将上线）',
    en: 'Wave / energy / tide charts (coming soon)'
  },
  map: {ja: '地図', zh: '地图视图', en: 'Map'},
  mapSub: {
    ja: '日本地図上のスポット分布（近日追加）',
    zh: '日本地图上的浪点分布（即将上线）',
    en: 'Spots on a Japan map (coming soon)'
  },
  myBox: {ja: 'マイポイント', zh: '我的浪点', en: 'My spots'},
  myBoxSub: {
    ja: 'ログイン後、レベル・ボード・出発地に合わせて並べ替え（近日追加）',
    zh: '登录后按你的水平、板型、出发地排序（即将上线）',
    en: 'Sorted by your level, board, and departure (coming soon)'
  },
  comingSoon: {ja: '近日追加', zh: '即将上线', en: 'Coming soon'}
} as const;

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const spotsWithCams = await prisma.spot.findMany({
    include: {cams: {where: {active: true}, orderBy: {id: 'asc'}}}
  });

  const hourlies = await Promise.all(
    spotsWithCams.map((s) => fetchHourly(s.latitude, s.longitude))
  );

  const forecasts: (Forecast | null)[] = hourlies.map((h) => {
    if (!h || h.currentIndex === -1) return null;
    const i = h.currentIndex;
    return {
      waveHeight: h.waveHeight[i] ?? null,
      wavePeriod: h.wavePeriod[i] ?? null,
      waveDirection: h.waveDirection[i] ?? null,
      windSpeed: h.windSpeed[i] ?? null,
      windDirection: h.windDirection[i] ?? null,
      temperature: h.temperature[i] ?? null,
      seaTemp: h.seaTemp[i] ?? null,
      observedAt: h.time[i]
    };
  });

  const bestWindows = hourlies.map((h, i) =>
    h ? bestWindow(h, spotsWithCams[i].offshoreWindDir) : null
  );

  const interpretations = await Promise.all(
    spotsWithCams.map((s, i) => {
      const f = forecasts[i];
      return f ? interpretSpot(s, f, lc) : Promise.resolve(null);
    })
  );

  const rows = spotsWithCams.map((s, i) => ({
    spot: s as Spot,
    forecast: forecasts[i],
    hourly: hourlies[i],
    interpretation: interpretations[i],
    bestWindow: bestWindows[i],
    cams: s.cams as Cam[]
  }));

  const chips = buildHeroChips(rows, lc);

  return (
    <>
      <Hero locale={lc} chips={chips} />

      <div className="mx-auto max-w-6xl px-5">
        <section id="spots" className="my-10">
          <h2 className="mb-1 text-xl font-bold">{H.spotsTitle[lc]}</h2>
          <p className="mb-5 text-[13.5px] text-muted">{H.spotsSub[lc]}</p>
          <SpotList rows={rows} locale={lc} />
        </section>

        <section id="trend" className="my-10">
          <h2 className="mb-1 text-xl font-bold">{H.trend[lc]}</h2>
          <p className="mb-5 text-[13.5px] text-muted">{H.trendSub[lc]}</p>
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-line bg-white text-sm text-muted">
            {H.comingSoon[lc]}
          </div>
        </section>

        <section id="map" className="my-10">
          <h2 className="mb-1 text-xl font-bold">{H.map[lc]}</h2>
          <p className="mb-5 text-[13.5px] text-muted">{H.mapSub[lc]}</p>
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-line bg-white text-sm text-muted">
            {H.comingSoon[lc]}
          </div>
        </section>

        <section id="mine" className="my-10">
          <div className="rounded-2xl bg-gradient-to-br from-[#0b2239] to-[#123c5e] p-7 text-white">
            <h2 className="text-xl font-bold">{H.myBox[lc]}</h2>
            <p className="mt-1 text-[13.5px] text-white/65">{H.myBoxSub[lc]}</p>
            <div className="mt-5 rounded-lg bg-white/5 py-8 text-center text-sm text-white/60">
              {H.comingSoon[lc]}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function buildHeroChips(
  rows: {spot: Spot; forecast: Forecast | null}[],
  locale: Locale
): HeroChip[] {
  const localeRegion = 'SHONAN' as Region;

  const scored = rows
    .filter((r) => r.forecast != null)
    .map((r) => ({...r, score: scoreOf(r.forecast)}))
    .sort((a, b) => b.score - a.score);

  const chips: HeroChip[] = [];

  const bestLocal = scored.find((s) => s.spot.region === localeRegion);
  if (bestLocal) {
    chips.push({
      kind: 'good-local',
      name: nameFor(bestLocal.spot, locale),
      score: bestLocal.score
    });
  }

  const bestNational = scored[0];
  if (bestNational && bestNational.spot.region !== localeRegion) {
    chips.push({
      kind: 'good-national',
      name: nameFor(bestNational.spot, locale),
      score: bestNational.score
    });
  }

  const worst = [...scored].sort((a, b) => a.score - b.score)[0];
  if (worst && worst.score < 35) {
    chips.push({
      kind: 'bad',
      name: nameFor(worst.spot, locale),
      score: worst.score
    });
  }

  return chips;
}

function nameFor(spot: Spot, locale: Locale): string {
  if (locale === 'ja') return spot.nameJa;
  if (locale === 'zh') return spot.nameZh ?? spot.nameJa;
  return spot.nameEn;
}
