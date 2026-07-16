import Link from 'next/link';
import {setRequestLocale} from 'next-intl/server';
import {CommunityCard} from '@/components/CommunityCard';
import {getAllCommunities} from '@/lib/communities';

type Locale = 'ja' | 'zh' | 'en';

const T = {
  title: {ja: 'グループ', zh: '圈子', en: 'Groups'},
  subtitle: {
    ja: 'ポイント別・レベル別のサーファー同士の輪。今日一緒に入る仲間、常連グループ、送迎シェアなど。',
    zh: '按浪点、按水平的冲浪圈子。今天一起下水、常驻小圈、拼车拼行程。',
    en: 'Spot- and level-based circles. Find a session buddy for today, join a regulars group, share rides.'
  },
  empty: {
    ja: 'まだ登録されているグループはありません。',
    zh: '暂时还没有圈子。',
    en: 'No groups registered yet.'
  },
  spotLink: {
    ja: 'ポイントを見る',
    zh: '看浪点',
    en: 'View spot'
  }
} as const;

export default async function GroupsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const lc = (['ja', 'zh', 'en'].includes(locale) ? locale : 'ja') as Locale;

  const communities = getAllCommunities();

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <header className="mb-8">
        <div className="mb-2 inline-block rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy">
          👥 {T.title[lc]}
        </div>
        <h1 className="text-4xl font-bold">{T.title[lc]}</h1>
        <p className="mt-2 text-muted">{T.subtitle[lc]}</p>
      </header>

      {communities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {T.empty[lc]}
        </div>
      ) : (
        <ul className="space-y-6">
          {communities.map((community) => (
            <li key={community.slug}>
              <CommunityCard community={community} locale={lc} />
              <div className="mt-2 text-right">
                <Link
                  href={`/${lc}/spots/${community.spotSlug}`}
                  className="text-sm text-ocean transition-colors hover:underline"
                >
                  {T.spotLink[lc]} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
