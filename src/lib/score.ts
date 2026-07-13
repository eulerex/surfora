import type {Forecast} from './openMeteo';

export function scoreOf(f: Forecast | null): number {
  if (!f) return 0;
  const wave = f.waveHeight ?? 0;
  const period = f.wavePeriod ?? 0;
  const wind = f.windSpeed ?? 10;
  const waveScore = wave > 0.3 && wave < 2.5 ? Math.min(50, wave * 30) : 0;
  const periodScore = Math.min(30, period * 3);
  const windPenalty = Math.max(0, (wind - 4) * 6);
  return Math.max(
    0,
    Math.min(100, Math.round(waveScore + periodScore - windPenalty))
  );
}
