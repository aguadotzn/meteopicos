// Cielo de la portada según el código WMO y si es de día o de noche.
export type Sky = 'clear' | 'partly' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm' | 'night' | 'night-cloudy';

export function skyFor(code: number, isDay = true): Sky {
  if (code >= 95) return 'storm';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 51) return 'rain';
  if (code === 45 || code === 48) return 'fog';
  if (!isDay) return code <= 1 ? 'night' : 'night-cloudy';
  if (code <= 1) return 'clear';
  if (code === 2) return 'partly';
  return 'cloudy';
}
