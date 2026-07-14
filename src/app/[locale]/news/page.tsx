import {setRequestLocale} from 'next-intl/server';
import {ComingSoonPage} from '@/components/ComingSoonPage';

type Locale = 'ja' | 'zh' | 'en';

const CONTENT = {
  ja: {
    title: 'ニュース',
    description:
      'サーフィン関連のニュースをAIが自動収集・要約。台風スウェル、大会情報、ローカルの話題、新製品など。',
    points: [
      '台風スウェル速報',
      '大会・イベント情報',
      'ローカルニュース（ポイント別）',
      '新製品・ボード・ウェット',
      'AI要約で流し読み'
    ]
  },
  zh: {
    title: '新闻',
    description:
      'AI 自动抓取 + 摘要冲浪相关新闻。台风浪速报、赛事、本地话题、新装备。',
    points: [
      '台风浪速报',
      '赛事 · 活动信息',
      '本地新闻（按浪点）',
      '新装备 · 板 · 湿衣',
      'AI 摘要，一分钟浏览'
    ]
  },
  en: {
    title: 'News',
    description:
      'AI-curated surf news with summaries. Typhoon swells, contests, local scenes, new gear.',
    points: [
      'Typhoon swell alerts',
      'Contests & events',
      'Local news per spot',
      'New boards & wetsuits',
      'AI summaries so you can skim'
    ]
  }
} as const;

export default async function NewsPage({
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
      emoji="📰"
      title={c.title}
      description={c.description}
      points={[...c.points]}
      locale={lc}
    />
  );
}
