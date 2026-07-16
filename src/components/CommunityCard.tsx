import type {Community} from '@/lib/communities';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  section: {ja: 'コミュニティ', zh: '圈子', en: 'Community'},
  members: {ja: 'メンバー', zh: '成员', en: 'Members'},
  leader: {ja: 'オーナー', zh: '群主', en: 'Group leader'}
} as const;

function localizedDesc(c: Community, locale: Locale): string {
  if (locale === 'ja') return c.descJa;
  if (locale === 'zh') return c.descZh;
  return c.descEn;
}

export function CommunityCard({
  community,
  locale
}: {
  community: Community;
  locale: Locale;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 border-b border-line pb-2 text-lg font-bold tracking-wider">
        {T.section[locale]}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {/* Cover — hand-drawn gradient + emoji title, no external image
           so we can tweak it without asset roundtrips. */}
        <div
          className="relative flex h-40 items-center justify-center overflow-hidden text-center sm:h-48"
          style={{
            background:
              'linear-gradient(135deg, #ffb26b 0%, #ff7a7a 35%, #6a5acd 70%, #0e4d7a 100%)'
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-16 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.55) 0%, transparent 65%)'
            }}
          />
          <div className="absolute left-6 top-6 h-14 w-14 rounded-full bg-yellow-200/80 blur-[2px]" />
          <div className="relative z-10 px-6">
            <div className="text-3xl font-bold tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:text-4xl">
              {community.name}
            </div>
            <div className="mt-1.5 text-xs uppercase tracking-[0.35em] text-white/85 sm:text-sm">
              湘南 · 鵠沼
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:p-6">
          <div className="mx-auto flex flex-col items-center gap-2 sm:mx-0">
            <div className="h-24 w-24 overflow-hidden rounded-full border-[3px] border-white shadow-md ring-1 ring-line sm:h-28 sm:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={community.leaderImage}
                alt={community.leaderName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted">
                {T.leader[locale]}
              </div>
              <div className="text-sm font-semibold text-ink">
                {community.leaderName}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-bold text-ink">{community.name}</span>
              <span className="rounded-full bg-sky-brand px-2.5 py-0.5 text-xs font-semibold text-ocean">
                {T.members[locale]}: {community.memberCount}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {localizedDesc(community, locale)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
