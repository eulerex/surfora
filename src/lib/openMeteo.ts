const MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEZONE = 'Asia/Tokyo';
const CACHE_TTL_SECONDS = 1800;

export type Forecast = {
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  temperature: number | null;
  observedAt: string;
};

type HourlyMarine = {
  hourly?: {
    time: string[];
    wave_height: (number | null)[];
    wave_period: (number | null)[];
    wave_direction: (number | null)[];
  };
};

type HourlyWeather = {
  hourly?: {
    time: string[];
    wind_speed_10m: (number | null)[];
    wind_direction_10m: (number | null)[];
    temperature_2m: (number | null)[];
  };
};

function tokyoHourKey(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}`;
}

export async function fetchForecast(
  lat: number,
  lng: number
): Promise<Forecast | null> {
  try {
    const marineUrl = `${MARINE_URL}?latitude=${lat}&longitude=${lng}&hourly=wave_height,wave_period,wave_direction&timezone=${TIMEZONE}&forecast_days=1`;
    const weatherUrl = `${WEATHER_URL}?latitude=${lat}&longitude=${lng}&hourly=wind_speed_10m,wind_direction_10m,temperature_2m&timezone=${TIMEZONE}&wind_speed_unit=ms&forecast_days=1`;

    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, {next: {revalidate: CACHE_TTL_SECONDS}}),
      fetch(weatherUrl, {next: {revalidate: CACHE_TTL_SECONDS}})
    ]);
    if (!marineRes.ok || !weatherRes.ok) return null;

    const marine: HourlyMarine = await marineRes.json();
    const weather: HourlyWeather = await weatherRes.json();
    if (!marine.hourly || !weather.hourly) return null;

    const hourKey = tokyoHourKey(new Date());
    const idx = marine.hourly.time.findIndex((t) => t.startsWith(hourKey));
    if (idx === -1) return null;

    return {
      waveHeight: marine.hourly.wave_height[idx] ?? null,
      wavePeriod: marine.hourly.wave_period[idx] ?? null,
      waveDirection: marine.hourly.wave_direction[idx] ?? null,
      windSpeed: weather.hourly.wind_speed_10m[idx] ?? null,
      windDirection: weather.hourly.wind_direction_10m[idx] ?? null,
      temperature: weather.hourly.temperature_2m[idx] ?? null,
      observedAt: marine.hourly.time[idx]
    };
  } catch {
    return null;
  }
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

export function compassPoint(deg: number | null): string | null {
  if (deg == null) return null;
  return COMPASS[Math.round(deg / 22.5) % 16];
}
