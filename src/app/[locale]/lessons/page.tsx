import {setRequestLocale} from 'next-intl/server';
import {ComingSoonPage} from '@/components/ComingSoonPage';

type Locale = 'ja' | 'zh' | 'en';

const CONTENT = {
  ja: {
    title: 'レッスン',
    description:
      '基礎から中級テクニックまでの動画・記事レッスン。ボード選び、パドリング、テイクオフ、ボトムターンなど。',
    points: [
      '初心者ステップアップコース',
      'ボード・ウェットスーツ選び方',
      'テクニック解説動画',
      '波の見方・カレントの読み方'
    ]
  },
  zh: {
    title: '教程',
    description:
      '从入门到进阶的视频和文章。选板、划水、Take Off、Bottom Turn，一步步过。',
    points: [
      '新手起步系列',
      '板型 & 湿衣挑选指南',
      '动作分解视频',
      '看浪 · 判断潮流的方法'
    ]
  },
  en: {
    title: 'Lessons',
    description:
      "Video and article lessons, from paddling to bottom turns. Board choice, wave reading, technique breakdowns.",
    points: [
      'Beginner step-up track',
      'Board & wetsuit picking guides',
      'Technique breakdown videos',
      'Wave & current reading'
    ]
  }
} as const;

export default async function LessonsPage({
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
      emoji="📚"
      title={c.title}
      description={c.description}
      points={[...c.points]}
      locale={lc}
    />
  );
}
