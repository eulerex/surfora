import {PrismaClient, Region} from '@prisma/client';

const prisma = new PrismaClient();

const spots = [
  {
    slug: 'kugenuma',
    sortOrder: 10,
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
    sortOrder: 20,
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
    sortOrder: 30,
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
    sortOrder: 40,
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
    sortOrder: 50,
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
    sortOrder: 60,
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
    sortOrder: 70,
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
    slug: 'oiso',
    sortOrder: 45,
    nameJa: '大磯',
    nameEn: 'Oiso',
    nameZh: '大矶',
    region: Region.SHONAN,
    latitude: 35.303,
    longitude: 139.303,
    trainAccessible: true,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北',
    descJa: '大磯町の海岸。JR大磯駅から徒歩10分。湘南の西端で人が少なく、初心者にも向く。',
    descEn: 'A quieter Shonan beach in Oiso town, ~10 min walk from JR Oiso Station. Less crowded than Kugenuma/Tsujido.',
    descZh: '大矶町的海岸。JR 大矶站徒步 10 分钟。湘南西端、人少、适合新手。'
  },
  {
    slug: 'shirahama',
    sortOrder: 75,
    nameJa: '白浜',
    nameEn: 'Shirahama',
    nameZh: '白滨',
    region: Region.SHIZUOKA,
    latitude: 34.688,
    longitude: 138.964,
    trainAccessible: false,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard', 'Shortboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '西',
    descJa: '伊豆・下田を代表するビーチブレイク。白砂と透明度の高い海。台風スウェルではパワーのある波が入る。',
    descEn: 'Izu peninsula\'s iconic beach break in Shimoda. White sand, clear water; powerful when typhoon swells hit.',
    descZh: '伊豆·下田代表性沙滩浪点。白沙、水质通透，台风浪期波形有力。'
  },
  {
    slug: 'kizakihama',
    sortOrder: 80,
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

const cams = [
  {
    slug: 'kugenuma-aquarium',
    spotSlug: 'kugenuma',
    nameJa: '鵠沼 水族館前',
    nameEn: 'Kugenuma Aquarium Front',
    nameZh: '鹄沼 水族馆前',
    youtubeVideoId: null,
    youtubeChannelId: null
  },
  {
    slug: 'kugenuma-enoshima',
    spotSlug: 'kugenuma',
    nameJa: '江の島ズーム',
    nameEn: 'Enoshima Zoom',
    nameZh: '江之岛特写',
    youtubeVideoId: 'ywXRfMLuw78',
    youtubeChannelId: null
  },
  {
    slug: 'shichirigahama-minehills',
    spotSlug: 'shichirigahama',
    nameJa: '七里ヶ浜 峰ヒルズ視点',
    nameEn: 'Shichirigahama Minehills view',
    nameZh: '七里滨 峰之丘视角',
    youtubeVideoId: 'LiBT8ZwoxMk',
    youtubeChannelId: null
  },
  {
    slug: 'shichirigahama-kamakura-koukou',
    spotSlug: 'shichirigahama',
    nameJa: '鎌倉高校前',
    nameEn: 'Kamakura Koko Mae (Slam Dunk crossing)',
    nameZh: '镰仓高校前',
    youtubeVideoId: 'wq5J3SZSdX8',
    youtubeChannelId: null
  },
  {
    slug: 'kugenuma-koshigoe',
    spotSlug: 'kugenuma',
    nameJa: '江の島 腰越海岸',
    nameEn: 'Enoshima Koshigoe Beach',
    nameZh: '江之岛 腰越海岸',
    youtubeVideoId: 'ESsZ9iB7tz0',
    youtubeChannelId: null
  },
  {
    slug: 'tsujido-beach',
    spotSlug: 'tsujido',
    nameJa: '辻堂海水浴場',
    nameEn: 'Tsujido Beach',
    nameZh: '辻堂海水浴场',
    youtubeVideoId: 'ceBqnSf8aRQ',
    youtubeChannelId: null
  },
  {
    slug: 'shirahama-chuo',
    spotSlug: 'shirahama',
    nameJa: '白浜中央ビーチ',
    nameEn: 'Shirahama Chuo Beach',
    nameZh: '白滨中央海滩',
    youtubeVideoId: 'mWu0lcIsEX8',
    youtubeChannelId: null
  },
  {
    slug: 'oiso-main',
    spotSlug: 'oiso',
    nameJa: '大磯海岸',
    nameEn: 'Oiso Beach',
    nameZh: '大矶海岸',
    youtubeVideoId: 'WV9DtVXgwqE',
    youtubeChannelId: null
  },
  {
    slug: 'tsujido-main',
    spotSlug: 'tsujido',
    nameJa: '辻堂正面',
    nameEn: 'Tsujido Main',
    nameZh: '辻堂正面',
    youtubeVideoId: null,
    youtubeChannelId: null
  },
  {
    slug: 'ichinomiya-cam',
    spotSlug: 'ichinomiya',
    nameJa: '一宮海岸',
    nameEn: 'Ichinomiya Beach',
    nameZh: '一宫海岸',
    youtubeVideoId: null,
    youtubeChannelId: null
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
  console.log(`→ ${spots.length} spots`);

  console.log('→ seeding cams...');
  for (const cam of cams) {
    const spot = await prisma.spot.findUnique({where: {slug: cam.spotSlug}});
    if (!spot) {
      console.warn(`  ✗ cam ${cam.slug} skipped (no spot ${cam.spotSlug})`);
      continue;
    }
    // youtubeVideoId / youtubeChannelId are set manually via SQL after seed
    // runs — they must NOT be reset on every container restart.
    const {
      spotSlug: _ignored,
      youtubeVideoId,
      youtubeChannelId,
      ...updateOnly
    } = cam;
    await prisma.cam.upsert({
      where: {slug: cam.slug},
      update: {...updateOnly, spotId: spot.id},
      create: {
        ...updateOnly,
        youtubeVideoId,
        youtubeChannelId,
        spotId: spot.id
      }
    });
    console.log(`  ✓ ${cam.slug} → ${cam.spotSlug}`);
  }
  console.log(`→ ${cams.length} cams`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
