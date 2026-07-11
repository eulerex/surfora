import {PrismaClient, Region} from '@prisma/client';

const prisma = new PrismaClient();

const spots = [
  {
    slug: 'kugenuma',
    nameJa: '鵠沼',
    nameEn: 'Kugenuma',
    nameZh: '鹄沼',
    region: Region.SHONAN,
    latitude: 35.317,
    longitude: 139.478,
    trainAccessible: true,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard'],
    optimalSwellDir: '南南东',
    offshoreWindDir: '北',
    descJa: '湘南で最も人気のあるサーフスポット。初心者にも優しい遠浅の砂浜。',
    descEn: 'The most popular surf spot in Shonan. Gentle sandy beach, beginner-friendly.',
    descZh: '湘南人气最高的浪点。远浅沙滩，对新手友好。'
  },
  {
    slug: 'tsujido',
    nameJa: '辻堂',
    nameEn: 'Tsujido',
    nameZh: '辻堂',
    region: Region.SHONAN,
    latitude: 35.322,
    longitude: 139.445,
    trainAccessible: true,
    beginnerFriendly: false,
    boardTypes: ['Funboard', 'Shortboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北',
    descJa: '鵠沼より少し人が少なく、波はやや厚め。中級以上向き。',
    descEn: 'Less crowded than Kugenuma, waves slightly steeper. Better for intermediate+.',
    descZh: '比鹄沼人少，浪略陡，中级以上更合适。'
  },
  {
    slug: 'inamuragasaki',
    nameJa: '稲村ヶ崎',
    nameEn: 'Inamuragasaki',
    nameZh: '稻村崎',
    region: Region.SHONAN,
    latitude: 35.302,
    longitude: 139.529,
    trainAccessible: true,
    beginnerFriendly: false,
    boardTypes: ['Shortboard'],
    optimalSwellDir: '南南西',
    offshoreWindDir: '北东',
    descJa: '台風スウェルが入ると本領発揮のポイントブレイク。上級者向け。',
    descEn: 'A point break that comes alive with typhoon swells. Advanced only.',
    descZh: '只有台风浪时才是它的主场。上级者向。'
  },
  {
    slug: 'shichirigahama',
    nameJa: '七里ヶ浜',
    nameEn: 'Shichirigahama',
    nameZh: '七里滨',
    region: Region.SHONAN,
    latitude: 35.305,
    longitude: 139.507,
    trainAccessible: true,
    beginnerFriendly: true,
    boardTypes: ['Longboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北',
    descJa: '江ノ島を望むロケーション。波は小さめでロングボード向き。',
    descEn: 'Views of Enoshima. Small waves, perfect for longboarding.',
    descZh: '眺望江之岛的风景。浪偏小，适合长板。'
  },
  {
    slug: 'ichinomiya',
    nameJa: '一宮',
    nameEn: 'Ichinomiya',
    nameZh: '一宫',
    region: Region.CHIBA,
    latitude: 35.371,
    longitude: 140.376,
    trainAccessible: false,
    beginnerFriendly: false,
    boardTypes: ['Funboard', 'Shortboard'],
    optimalSwellDir: '东南',
    offshoreWindDir: '北西',
    descJa: '2020年東京五輪サーフィン競技会場。年間通して波が期待できる。',
    descEn: 'Host of the 2020 Tokyo Olympics surfing event. Reliable waves year-round.',
    descZh: '2020 东京奥运会冲浪比赛场地。全年浪况可期。'
  },
  {
    slug: 'torami',
    nameJa: '東浪見',
    nameEn: 'Torami',
    nameZh: '东浪见',
    region: Region.CHIBA,
    latitude: 35.348,
    longitude: 140.418,
    trainAccessible: false,
    beginnerFriendly: false,
    boardTypes: ['Shortboard'],
    optimalSwellDir: '东南',
    offshoreWindDir: '北西',
    descJa: '一宮より波にパワーがあり、アクションを練習したい人向け。',
    descEn: 'More powerful waves than Ichinomiya. Good for practicing turns.',
    descZh: '浪比一宫更有力，适合练动作的人。'
  },
  {
    slug: 'shizunami',
    nameJa: '静波',
    nameEn: 'Shizunami',
    nameZh: '静波',
    region: Region.SHIZUOKA,
    latitude: 34.660,
    longitude: 138.241,
    trainAccessible: false,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard', 'Shortboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北',
    descJa: '静岡の代表的なビーチブレイク。西風が入りやすいので午前中が狙い目。',
    descEn: 'A signature Shizuoka beach break. Westerlies pick up in afternoon.',
    descZh: '静冈的代表性沙滩浪点。下午西风常起，早上更佳。'
  },
  {
    slug: 'kizakihama',
    nameJa: '木崎浜',
    nameEn: 'Kizakihama',
    nameZh: '木崎浜',
    region: Region.MIYAZAKI,
    latitude: 31.867,
    longitude: 131.441,
    trainAccessible: false,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard', 'Shortboard'],
    optimalSwellDir: '南东',
    offshoreWindDir: '西',
    descJa: '南九州随一のサーフタウン。長い周期の南うねりが入る。',
    descEn: 'Southern Kyushu\'s premier surf town. Long-period south swells.',
    descZh: '南九州首屈一指的冲浪小镇。长周期南涌。'
  }
];

async function main() {
  console.log('→ seeding spots...');
  for (const spot of spots) {
    await prisma.spot.upsert({
      where: {slug: spot.slug},
      update: spot,
      create: spot
    });
    console.log(`  ✓ ${spot.slug} (${spot.nameJa})`);
  }
  console.log(`→ done, ${spots.length} spots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
