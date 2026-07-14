import {setRequestLocale} from 'next-intl/server';
import {ComingSoonPage} from '@/components/ComingSoonPage';

type Locale = 'ja' | 'zh' | 'en';

const CONTENT = {
  ja: {
    title: 'グループ',
    description:
      'ポイント別・レベル別のサーファー同士の輪。今日一緒に入る仲間を探したり、常連グループに参加したり、送迎シェアを組んだり。',
    points: [
      'ポイント別コミュニティ（鵠沼、辻堂、一宮…）',
      'レベル別グループ（初心者・中級・上級）',
      '今日一緒に入る「今から誘う」フィード',
      '車の相乗り・送迎シェア'
    ]
  },
  zh: {
    title: '圈子',
    description:
      '按浪点、按水平的冲浪圈子。找今天一起下水的伙伴、加入常驻小圈、拼车拼行程。',
    points: [
      '按浪点分（鵠沼、辻堂、一宫…）',
      '按水平分（新手 / 中级 / 上级）',
      '"今天有人一起吗"实时约浪',
      '车拼、住宿拼'
    ]
  },
  en: {
    title: 'Groups',
    description:
      'Spot- and level-based circles. Find a session buddy for today, join a regulars group, share rides.',
    points: [
      'Per-spot communities (Kugenuma, Tsujido, Ichinomiya…)',
      'Level-based groups (beginner / intermediate / advanced)',
      '"Who\'s going today?" real-time board',
      'Ride shares & road trips'
    ]
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
  const c = CONTENT[lc];
  return (
    <ComingSoonPage
      emoji="👥"
      title={c.title}
      description={c.description}
      points={[...c.points]}
      locale={lc}
    />
  );
}
