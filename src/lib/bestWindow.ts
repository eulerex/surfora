import type {HourlyForecast} from './openMeteo';

// Rough degree lookup for the Chinese/Japanese direction strings we seed.
const DIR_TO_DEG: Record<string, number> = {
  '北': 0,
  '北北東': 22.5,
  '北東': 45, '東北': 45,
  '東北東': 67.5,
  '東': 90, '东': 90,
  '東南東': 112.5,
  '東南': 135, '南東': 135, '南东': 135, '东南': 135,
  '南南東': 157.5, '南南东': 157.5,
  '南': 180,
  '南南西': 202.5,
  '南西': 225, '西南': 225,
  '西南西': 247.5,
  '西': 270,
  '西北西': 292.5,
  '北西': 315, '西北': 315,
  '北北西': 337.5
};

function stringToDegrees(dir: string | null): number | null {
  if (!dir) return null;
  return DIR_TO_DEG[dir.trim()] ?? null;
}

function angularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export type Window = {
  startHour: number;
  endHour: number;
};

/**
 * Find the longest contiguous run of "good conditions" in today's hourly forecast.
 * Good = wave in 0.4-2.5m, wind ≤ 6 m/s, and (if we know offshore) wind is
 * within 60° of the offshore direction.
 * Returns null if no window has at least 2 hours.
 */
export function bestWindow(
  hourly: HourlyForecast,
  offshoreDir: string | null
): Window | null {
  const offshoreDeg = stringToDegrees(offshoreDir);

  const good: boolean[] = hourly.time.map((_, i) => {
    const wave = hourly.waveHeight[i];
    const wind = hourly.windSpeed[i];
    const windDir = hourly.windDirection[i];

    if (wave == null || wind == null) return false;
    if (wave < 0.4 || wave > 2.5) return false;
    if (wind > 6) return false;

    if (offshoreDeg != null && windDir != null) {
      // Offshore wind blows FROM land TO sea; direction indicates where the
      // wind comes FROM. If offshoreDir="北", we want winds coming from
      // roughly north.
      if (angularDiff(windDir, offshoreDeg) > 60) return false;
    }

    return true;
  });

  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  for (let i = 0; i < good.length; i++) {
    if (good[i]) {
      if (curStart === -1) curStart = i;
      const len = i - curStart + 1;
      if (len > bestLen) {
        bestStart = curStart;
        bestLen = len;
      }
    } else {
      curStart = -1;
    }
  }

  if (bestLen < 2) return null;

  const startHour = extractHour(hourly.time[bestStart]);
  const endHour = extractHour(hourly.time[bestStart + bestLen - 1]) + 1;
  return {startHour, endHour};
}

function extractHour(iso: string): number {
  const m = iso.match(/T(\d{2})/);
  return m ? parseInt(m[1], 10) : 0;
}

export function formatWindow(w: Window | null): string {
  if (!w) return '—';
  return `${w.startHour.toString().padStart(2, '0')}:00 – ${w.endHour.toString().padStart(2, '0')}:00`;
}
