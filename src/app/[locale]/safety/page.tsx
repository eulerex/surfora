import {setRequestLocale} from 'next-intl/server';
import {ComingSoonPage} from '@/components/ComingSoonPage';

type Locale = 'ja' | 'zh' | 'en';

const CONTENT = {
  ja: {
    title: '安全',
    description:
      '海のリスクを減らすためのチェックリスト。カレント、離岸流、天候急変、体力管理、緊急連絡先など。',
    points: [
      '離岸流の見分け方と抜け方',
      '入水前チェックリスト',
      '天候急変時の判断基準',
      '救助要請・緊急連絡先まとめ',
      'ローカル・マナー'
    ]
  },
  zh: {
    title: '安全',
    description:
      '把海里的风险降下来的清单：判断离岸流、突变天气、体能管理、报警求助方式，还有本地礼仪。',
    points: [
      '离岸流的识别与逃脱',
      '下水前自查清单',
      '天气突变时的判断',
      '报警求救 & 紧急联系方式',
      '本地礼仪 · 与本地人相处'
    ]
  },
  en: {
    title: 'Safety',
    description:
      'Checklists to keep you out of trouble: rip currents, sudden weather, energy management, rescue contacts, local etiquette.',
    points: [
      'Rip current spotting & escape',
      'Pre-paddle checklist',
      'Reading sudden weather changes',
      'Emergency contacts & rescue',
      'Local etiquette'
    ]
  }
} as const;

export default async function SafetyPage({
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
      emoji="🛟"
      title={c.title}
      description={c.description}
      points={[...c.points]}
      locale={lc}
    />
  );
}
