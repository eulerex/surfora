export type Community = {
  slug: string;
  spotSlug: string;
  name: string;
  memberCount: number;
  leaderImage: string;
  leaderName: string;
  descJa: string;
  descEn: string;
  descZh: string;
};

export const COMMUNITIES: Record<string, Community> = {
  kugenuma: {
    slug: 'kugenuma',
    spotSlug: 'kugenuma',
    name: '🏄 冲浪 🏄 🇯🇵',
    memberCount: 195,
    leaderImage: '/community/kugenuma-leader.jpg',
    leaderName: 'Riku',
    descJa: '鵠沼を拠点にする在日サーファーコミュニティ。週末のセッション、初心者ガイド、波情報の共有まで。',
    descEn: 'Kugenuma-based surfer community. Weekend sessions, beginner guides, wave-info sharing.',
    descZh: '鹄沼为主的在日冲浪社群，周末冲浪、新手带练、浪况分享。'
  }
};

export function getCommunity(slug: string): Community | null {
  return COMMUNITIES[slug] ?? null;
}

export function getAllCommunities(): Community[] {
  return Object.values(COMMUNITIES);
}
