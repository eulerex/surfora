import type {Spot, Region} from '@prisma/client';
import {setRequestLocale} from 'next-intl/server';
import {prisma} from '@/lib/prisma';

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
    ja: '静的な浪点データ。予報接続は次のステップ。',
    zh: '静态浪点数据。预报接入是下一步。',
    en: 'Static spot data. Forecast integration is next.'
  },
  boardTypes: {ja: '板の種類', zh: '板型', en: 'Boards'},
  train: {ja: '電車で行ける', zh: '电车可达', en: 'Train accessible'},
  beginner: {ja: '初心者向け', zh: '新手友好', en: 'Beginner-friendly'},
  coords: {ja: '座標', zh: '坐标', en: 'Coordinates'}
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
            {byRegion[region].map((spot) => (
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
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-zinc-500">
                  {spot.boardTypes.length > 0 && (
                    <>
                      <dt>{UI.boardTypes[lc]}</dt>
                      <dd className="text-zinc-300">
                        {spot.boardTypes.join(' / ')}
                      </dd>
                    </>
                  )}
                  <dt>{UI.coords[lc]}</dt>
                  <dd className="text-zinc-300">
                    {spot.latitude.toFixed(3)}, {spot.longitude.toFixed(3)}
                  </dd>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {spots.length === 0 && (
        <p className="text-center text-zinc-500">
          {lc === 'ja'
            ? 'データベースにポイントがありません。seedスクリプトを実行してください。'
            : lc === 'zh'
              ? '数据库中还没有浪点。运行 seed 脚本导入。'
              : 'No spots in the database yet. Run the seed script.'}
        </p>
      )}
    </main>
  );
}
