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
    descZh: '湘南人气最高的浪点。远浅沙滩，对新手友好。',
    locationJa: '神奈川県 藤沢市',
    locationEn: 'Fujisawa, Kanagawa',
    locationZh: '神奈川·藤泽'
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
    descZh: '比鹄沼人少，浪略陡，中级以上更合适。',
    locationJa: '神奈川県 藤沢市',
    locationEn: 'Fujisawa, Kanagawa',
    locationZh: '神奈川·藤泽'
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
    descZh: '只有台风浪时才是它的主场。上级者向。',
    locationJa: '神奈川県 鎌倉市',
    locationEn: 'Kamakura, Kanagawa',
    locationZh: '神奈川·镰仓'
  },
  {
    slug: 'koshigoe',
    sortOrder: 35,
    nameJa: '腰越',
    nameEn: 'Koshigoe',
    nameZh: '腰越',
    region: Region.SHONAN,
    latitude: 35.307,
    longitude: 139.501,
    trainAccessible: true,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard', 'Shortboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北',
    descJa: '江の島の東側、腰越海岸。江ノ電「腰越」駅すぐ。鵠沼より波にパワーがあり、台風スウェルで本領発揮。',
    descEn: 'East of Enoshima, along Koshigoe Beach. Right by Enoden Koshigoe station. More powerful than Kugenuma; comes alive with typhoon swells.',
    descZh: '江之岛东侧的腰越海岸。江之电「腰越」站即达。浪比鹄沼有力，台风浪期最出彩。',
    locationJa: '神奈川県 鎌倉市',
    locationEn: 'Kamakura, Kanagawa',
    locationZh: '神奈川·镰仓'
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
    descZh: '眺望江之岛的风景。浪偏小，适合长板。',
    locationJa: '神奈川県 鎌倉市',
    locationEn: 'Kamakura, Kanagawa',
    locationZh: '神奈川·镰仓'
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
    descZh: '2020 东京奥运会冲浪比赛场地。全年浪况可期。',
    locationJa: '千葉県 一宮町',
    locationEn: 'Ichinomiya, Chiba',
    locationZh: '千叶·一宫町'
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
    descZh: '浪比一宫更有力，适合练动作的人。',
    locationJa: '千葉県 一宮町',
    locationEn: 'Ichinomiya, Chiba',
    locationZh: '千叶·一宫町'
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
    descZh: '静冈的代表性沙滩浪点。下午西风常起，早上更佳。',
    locationJa: '静岡県 牧之原市',
    locationEn: 'Makinohara, Shizuoka',
    locationZh: '静冈·牧之原'
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
    descZh: '大矶町的海岸。JR 大矶站徒步 10 分钟。湘南西端、人少、适合新手。',
    locationJa: '神奈川県 大磯町',
    locationEn: 'Oiso, Kanagawa',
    locationZh: '神奈川·大矶町'
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
    descZh: '伊豆·下田代表性沙滩浪点。白沙、水质通透，台风浪期波形有力。',
    locationJa: '静岡県 下田市',
    locationEn: 'Shimoda, Shizuoka',
    locationZh: '静冈·下田'
  },
  {
    slug: 'wedge',
    sortOrder: 105,
    nameJa: 'ザ・ウェッジ',
    nameEn: 'The Wedge',
    nameZh: '楔角',
    region: Region.WORLD,
    latitude: 33.590,
    longitude: -117.883,
    trainAccessible: false,
    beginnerFriendly: false,
    boardTypes: ['Shortboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北東',
    descJa: 'カリフォルニア・ニューポートビーチの伝説的なショアブレイク。防波堤に反射した南うねりが鋭角の三角波を生み、ボディサーフィン／ボディボードの聖地として世界的に有名。',
    descEn: 'Legendary shore break at Newport Beach, California. Refracted south swells create the signature triangular peak — a world-famous bodysurfing / bodyboarding mecca.',
    descZh: '加州新港海滩传奇的 shore break。防波堤反射南涌形成三角尖峰浪，是世界闻名的 bodysurf / bodyboard 圣地。',
    locationJa: 'カリフォルニア州 ニューポートビーチ',
    locationEn: 'Newport Beach, California',
    locationZh: '加州·新港海滩'
  },
  {
    slug: 'waikiki',
    sortOrder: 100,
    nameJa: 'ワイキキ',
    nameEn: 'Waikiki',
    nameZh: '威基基',
    region: Region.WORLD,
    latitude: 21.276,
    longitude: -157.827,
    trainAccessible: false,
    beginnerFriendly: true,
    boardTypes: ['Longboard', 'Funboard'],
    optimalSwellDir: '南',
    offshoreWindDir: '北東',
    descJa: 'ハワイ・オアフ島のワイキキビーチ。世界的なロングボード発祥地の一つ。ロングでゆったり、初心者にも優しい波質。',
    descEn: 'Waikiki Beach on Oahu, Hawaii — one of the birthplaces of modern longboarding. Mellow, forgiving waves, perfect for beginners.',
    descZh: '夏威夷欧胡岛威基基海滩。现代长板发源地之一。浪长而温和，对新手友好。',
    locationJa: 'ハワイ・オアフ島',
    locationEn: 'Oahu, Hawaii',
    locationZh: '夏威夷·欧胡岛'
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
    descZh: '南九州首屈一指的冲浪小镇。长周期南涌。',
    locationJa: '宮崎県 宮崎市',
    locationEn: 'Miyazaki, Miyazaki',
    locationZh: '宫崎·宫崎市'
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
    slug: 'shichirigahama-kamakura-koukou',
    spotSlug: 'shichirigahama',
    nameJa: '鎌倉高校前',
    nameEn: 'Kamakura Koko Mae (Slam Dunk crossing)',
    nameZh: '镰仓高校前',
    youtubeVideoId: 'wq5J3SZSdX8',
    youtubeChannelId: null
  },
  {
    slug: 'koshigoe-main',
    spotSlug: 'koshigoe',
    nameJa: '腰越海岸',
    nameEn: 'Koshigoe Beach',
    nameZh: '腰越海岸',
    youtubeVideoId: 'ESsZ9iB7tz0',
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
    slug: 'shirahama-ohama',
    spotSlug: 'shirahama',
    nameJa: '白浜大浜海水浴場',
    nameEn: 'Shirahama Ohama Beach',
    nameZh: '白滨大滨海水浴场',
    youtubeVideoId: '_Upz1dlQgpg',
    youtubeChannelId: null
  },
  {
    slug: 'waikiki-marriott',
    spotSlug: 'waikiki',
    nameJa: 'ワイキキ ビーチ (Marriott)',
    nameEn: 'Waikiki Beach (Marriott)',
    nameZh: '威基基海滩 (Marriott)',
    youtubeVideoId: '8waVy4wM1tM',
    youtubeChannelId: null
  },
  {
    slug: 'wedge-247',
    spotSlug: 'wedge',
    nameJa: 'ザ・ウェッジ 24/7',
    nameEn: 'The Wedge 24/7',
    nameZh: 'The Wedge 24/7',
    youtubeVideoId: '4qxqhe67ejU',
    youtubeChannelId: null
  },
];

// Cams / spots that used to exist but have been renamed, promoted, or
// removed because their upstream YouTube video blocked embedding.
// Deleted at the top of every seed so stale rows don't linger in prod.
const staleCamSlugs = [
  'kugenuma-koshigoe',
  // Video owners disabled embed (oEmbed returns 401), so the iframe
  // shows "视频所有者已禁止在其他网站上播放此视频". Removed until we
  // find replacement live sources for the same beach.
  'shichirigahama-minehills',
  'oiso-main',
  // Empty placeholder cams with no video ID. When a spot has zero cams
  // the UI falls to "此浪点尚未登记直播摄像头", which reads cleaner than
  // an always-offline tab sitting next to a working one (辻堂正面 vs
  // 辻堂海水浴場). Re-add as fresh entries when we find live sources.
  'tsujido-main',
  'ichinomiya-cam',
  // Not actually a live stream — the video is a 61-second recorded clip
  // dressed up with "ライブカメラ" in the title. Removed until we find
  // a real 辻堂 live feed.
  'tsujido-beach'
];

async function main() {
  if (staleCamSlugs.length > 0) {
    const {count} = await prisma.cam.deleteMany({
      where: {slug: {in: staleCamSlugs}}
    });
    if (count > 0) console.log(`→ removed ${count} stale cam(s)`);
  }

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
