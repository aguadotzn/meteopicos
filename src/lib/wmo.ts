// Códigos de tiempo WMO (los que devuelve Open-Meteo) → icono y descripción.
// https://open-meteo.com/en/docs#weather_variable_documentation

const codes: Record<number, [string, string]> = {
  0: ['☀️', 'Despejado'],
  1: ['🌤️', 'Poco nuboso'],
  2: ['⛅', 'Intervalos nubosos'],
  3: ['☁️', 'Cubierto'],
  45: ['🌫️', 'Niebla'],
  48: ['🌫️', 'Niebla con escarcha'],
  51: ['🌦️', 'Llovizna débil'],
  53: ['🌦️', 'Llovizna'],
  55: ['🌧️', 'Llovizna intensa'],
  56: ['🌧️', 'Llovizna helada'],
  57: ['🌧️', 'Llovizna helada intensa'],
  61: ['🌧️', 'Lluvia débil'],
  63: ['🌧️', 'Lluvia'],
  65: ['🌧️', 'Lluvia intensa'],
  66: ['🌧️', 'Lluvia helada'],
  67: ['🌧️', 'Lluvia helada intensa'],
  71: ['🌨️', 'Nieve débil'],
  73: ['🌨️', 'Nieve'],
  75: ['❄️', 'Nieve intensa'],
  77: ['🌨️', 'Granos de nieve'],
  80: ['🌦️', 'Chubascos débiles'],
  81: ['🌧️', 'Chubascos'],
  82: ['⛈️', 'Chubascos fuertes'],
  85: ['🌨️', 'Chubascos de nieve'],
  86: ['❄️', 'Chubascos de nieve fuertes'],
  95: ['⛈️', 'Tormenta'],
  96: ['⛈️', 'Tormenta con granizo'],
  99: ['⛈️', 'Tormenta con granizo fuerte'],
};

export function wmo(code: number): { icon: string; label: string } {
  const [icon, label] = codes[code] ?? ['❔', 'Sin dato'];
  return { icon, label };
}
