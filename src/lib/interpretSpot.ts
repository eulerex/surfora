import type {Spot} from '@prisma/client';
import {unstable_cache} from 'next/cache';
import {chat} from './miniMax';
import {compassPoint, type Forecast} from './openMeteo';

type Locale = 'ja' | 'zh' | 'en';

const SYSTEM_BY_LOCALE: Record<Locale, string> = {
  ja: `あなたは日本のサーフィンに詳しいアドバイザーです。ポイントの特性と当日の予報を見て、1文（30-50文字）で「今日そこに行くべきか」の判断を書きます。数字は最小限。「新手にも良い」「上級者向き」「今日は避けたい」など具体的に。絵文字なし。前置きや説明なし、日本語で答えのみ。`,
  zh: `你是一位懂日本冲浪的顾问。看浪点特性和今日预报，用一句 20-40 字直接判断"今天该不该去"。少用数字，多说人话，比如"新手今天很值得去""下午风乱建议避开""上级者向"。不用 emoji，不要前置说明，直接给答案。`,
  en: `You are a surf advisor for Japan spots. Given the spot's characteristics and today's forecast, write ONE sentence (15-30 words) telling the reader whether to go today and why. Skip the numbers, be direct: "great for beginners today", "advanced only", "skip it, wind's a mess". No emojis, no preamble, just the sentence.`
};

function forecastLine(f: Forecast, locale: Locale): string {
  const parts: string[] = [];
  if (f.waveHeight != null) {
    parts.push(
      locale === 'ja'
        ? `波高 ${f.waveHeight.toFixed(1)}m`
        : locale === 'zh'
          ? `浪高 ${f.waveHeight.toFixed(1)}m`
          : `wave ${f.waveHeight.toFixed(1)}m`
    );
  }
  if (f.wavePeriod != null) {
    parts.push(
      locale === 'ja'
        ? `周期 ${f.wavePeriod.toFixed(0)}s`
        : locale === 'zh'
          ? `周期 ${f.wavePeriod.toFixed(0)}s`
          : `period ${f.wavePeriod.toFixed(0)}s`
    );
  }
  if (f.windSpeed != null) {
    const dir = compassPoint(f.windDirection) ?? '';
    parts.push(
      locale === 'ja'
        ? `風 ${dir} ${f.windSpeed.toFixed(1)}m/s`
        : locale === 'zh'
          ? `风 ${dir} ${f.windSpeed.toFixed(1)}m/s`
          : `wind ${dir} ${f.windSpeed.toFixed(1)}m/s`
    );
  }
  if (f.temperature != null) {
    parts.push(
      locale === 'ja'
        ? `気温 ${f.temperature.toFixed(0)}°C`
        : locale === 'zh'
          ? `气温 ${f.temperature.toFixed(0)}°C`
          : `air ${f.temperature.toFixed(0)}°C`
    );
  }
  return parts.join(' · ');
}

function spotProfileText(spot: Spot, locale: Locale): string {
  const lines: string[] = [];
  const name =
    locale === 'ja'
      ? spot.nameJa
      : locale === 'zh'
        ? (spot.nameZh ?? spot.nameJa)
        : spot.nameEn;
  lines.push(`${name} (${spot.region})`);

  const desc =
    locale === 'ja'
      ? spot.descJa
      : locale === 'zh'
        ? spot.descZh
        : spot.descEn;
  if (desc) lines.push(desc);

  const traits: string[] = [];
  if (spot.beginnerFriendly) {
    traits.push(
      locale === 'ja'
        ? '初心者向け'
        : locale === 'zh'
          ? '适合新手'
          : 'beginner-friendly'
    );
  }
  if (spot.trainAccessible) {
    traits.push(
      locale === 'ja'
        ? '電車で行ける'
        : locale === 'zh'
          ? '电车可达'
          : 'train accessible'
    );
  }
  if (spot.boardTypes.length > 0) {
    traits.push(
      (locale === 'ja'
        ? '推奨板: '
        : locale === 'zh'
          ? '推荐板型: '
          : 'boards: ') + spot.boardTypes.join(' / ')
    );
  }
  if (spot.offshoreWindDir) {
    traits.push(
      (locale === 'ja'
        ? '離岸風向: '
        : locale === 'zh'
          ? '离岸风向: '
          : 'offshore wind from: ') + spot.offshoreWindDir
    );
  }
  if (spot.optimalSwellDir) {
    traits.push(
      (locale === 'ja'
        ? '最適スウェル向: '
        : locale === 'zh'
          ? '最优浪向: '
          : 'best swell from: ') + spot.optimalSwellDir
    );
  }
  if (traits.length > 0) lines.push(traits.join(' / '));

  return lines.join('\n');
}

async function generate(
  spot: Spot,
  forecast: Forecast,
  locale: Locale
): Promise<string | null> {
  const profile = spotProfileText(spot, locale);
  const fc = forecastLine(forecast, locale);
  const userPrompt =
    locale === 'ja'
      ? `【ポイント】\n${profile}\n\n【今日の予報】${fc}\n\nこのポイントに今日行くべきか、1文で判断してください。`
      : locale === 'zh'
        ? `【浪点】\n${profile}\n\n【今日预报】${fc}\n\n用一句话判断这里今天该不该去。`
        : `[Spot]\n${profile}\n\n[Today's forecast] ${fc}\n\nGive one sentence: should someone surf here today?`;

  return chat({
    system: SYSTEM_BY_LOCALE[locale],
    messages: [{role: 'user', content: userPrompt}],
    maxTokens: 200,
    temperature: 0.7
  });
}

function bucketKey(f: Forecast): string {
  const hour = f.observedAt.slice(0, 13);
  const wave = f.waveHeight?.toFixed(1) ?? 'na';
  const wind = f.windSpeed?.toFixed(0) ?? 'na';
  return `${hour}|${wave}|${wind}`;
}

/**
 * Cached wrapper. Same (spot, hour, wave/wind bucket, locale) reuses.
 * Keeps MiniMax cost bounded (~8 spots * 3 langs * new hour = ~24 calls/hr).
 */
export async function interpretSpot(
  spot: Spot,
  forecast: Forecast,
  locale: Locale
): Promise<string | null> {
  const key = bucketKey(forecast);
  const cached = unstable_cache(
    async () => generate(spot, forecast, locale),
    ['spot-interpret', spot.slug, locale, key],
    {revalidate: 3600, tags: ['spot-interpret']}
  );
  return cached();
}
