// Previsión por puntos desde Open-Meteo (una sola petición para todos los puntos).
import type { Point } from '../data/zones';

export interface Day {
  date: string;
  code: number;
  tMax: number;
  tMin: number;
  precip: number;
  precipProb: number;
  snow: number;
  gust: number;
  windDir: number;
  freezingLevel: number | null;
}

// Condiciones en el momento de la consulta (para el cielo de la portada).
export interface Current {
  /** Hora local a la que se refieren los datos (AAAA-MM-DDTHH:MM) */
  time: string;
  temp: number;
  code: number;
  isDay: boolean;
}

export interface PointForecast {
  point: Point;
  days: Day[];
  current?: Current;
}

export interface Forecast {
  fetchedAt: number;
  points: PointForecast[];
}

const API = 'https://api.open-meteo.com/v1/forecast';
const DAYS = 6;
const CACHE_KEY = 'meteopicos:forecast:v3';
const CACHE_MS = 30 * 60 * 1000;

const DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'snowfall_sum',
  'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
].join(',');

interface ApiLocation {
  daily: Record<string, (number | null)[]> & { time: string[] };
  hourly: { time: string[]; freezing_level_height: (number | null)[] };
  current?: { time: string; temperature_2m: number; weather_code: number; is_day: number };
}

// Media diurna (8–20 h) de la isoterma de 0 °C para cada día.
function dailyFreezing(hourly: ApiLocation['hourly'], date: string): number | null {
  const values = hourly.time
    .map((t, i) => [t, hourly.freezing_level_height[i]] as const)
    .filter(([t, v]) => t.startsWith(date) && v != null && +t.slice(11, 13) >= 8 && +t.slice(11, 13) <= 20)
    .map(([, v]) => v as number);
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

interface Parsed {
  days: Day[];
  current?: Current;
}

function parse(data: ApiLocation | ApiLocation[]): Parsed[] {
  const locations = Array.isArray(data) ? data : [data];
  return locations.map((loc) => {
    const d = loc.daily;
    const num = (key: string, j: number) => d[key]?.[j] ?? 0;
    const c = loc.current;
    const current = c && { time: c.time, temp: c.temperature_2m, code: c.weather_code, isDay: c.is_day === 1 };
    const days = d.time.map((date, j) => ({
      date,
      code: num('weather_code', j),
      tMax: num('temperature_2m_max', j),
      tMin: num('temperature_2m_min', j),
      precip: num('precipitation_sum', j),
      precipProb: num('precipitation_probability_max', j),
      snow: num('snowfall_sum', j),
      gust: num('wind_gusts_10m_max', j),
      windDir: num('wind_direction_10m_dominant', j),
      freezingLevel: dailyFreezing(loc.hourly, date),
    }));
    return { days, current };
  });
}

export interface Spot {
  lat: number;
  lon: number;
  altitude: number;
}

// Una petición a Open-Meteo para varios puntos a la vez.
async function request(spots: Spot[], days: number): Promise<Parsed[]> {
  const params = new URLSearchParams({
    latitude: spots.map((p) => p.lat).join(','),
    longitude: spots.map((p) => p.lon).join(','),
    elevation: spots.map((p) => p.altitude).join(','),
    daily: DAILY,
    hourly: 'freezing_level_height',
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'Europe/Madrid',
    forecast_days: String(days),
  });
  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  return parse(await res.json());
}

function readCache(): Forecast | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as Forecast;
    return Date.now() - cached.fetchedAt < CACHE_MS ? cached : null;
  } catch {
    return null;
  }
}

function writeCache(f: Forecast) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(f));
  } catch {
    // Sin almacenamiento disponible: se vuelve a pedir en la próxima visita.
  }
}

export async function getForecast(points: Point[]): Promise<Forecast> {
  const cached = readCache();
  if (cached && cached.points.length === points.length) {
    // Los puntos vienen del código actual, no de la caché.
    cached.points.forEach((p, i) => (p.point = points[i]));
    return cached;
  }

  const parsed = await request(points, DAYS);
  const forecast: Forecast = { fetchedAt: Date.now(), points: points.map((point, i) => ({ point, ...parsed[i] })) };
  writeCache(forecast);
  return forecast;
}

// Previsión de un único punto (cumbre, ruta…) pedida a demanda; se guarda en memoria.
const spotCache = new Map<string, Promise<Day[]>>();
export function getSpotForecast(spot: Spot, days = 3): Promise<Day[]> {
  const key = `${spot.lat},${spot.lon},${spot.altitude},${days}`;
  if (!spotCache.has(key)) {
    const p = request([spot], days).then((r) => r[0].days);
    p.catch(() => spotCache.delete(key));
    spotCache.set(key, p);
  }
  return spotCache.get(key)!;
}

// Resumen de un grupo de puntos por día: máxima más alta, mínima más baja,
// el tiempo más adverso (código WMO mayor) y la probabilidad más alta.
export function summarize(group: PointForecast[]): Day[] {
  const first = group[0]?.days ?? [];
  return first.map((_, j) => {
    const days = group.map((p) => p.days[j]);
    const levels = days.map((d) => d.freezingLevel).filter((v): v is number => v != null);
    return {
      date: days[0].date,
      code: Math.max(...days.map((d) => d.code)),
      tMax: Math.max(...days.map((d) => d.tMax)),
      tMin: Math.min(...days.map((d) => d.tMin)),
      precip: Math.max(...days.map((d) => d.precip)),
      precipProb: Math.max(...days.map((d) => d.precipProb)),
      snow: Math.max(...days.map((d) => d.snow)),
      gust: Math.max(...days.map((d) => d.gust)),
      windDir: days[0].windDir,
      freezingLevel: levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : null,
    };
  });
}
