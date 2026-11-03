// Zonas y puntos de previsión.
// Coordenadas aproximadas (WGS84). `altitude` es la cota real del punto: se envía a
// Open-Meteo como `elevation` para que corrija la temperatura por altitud.

export type ZoneId = 'cornion' | 'urrieles' | 'andara' | 'valles';
export type Level = 'valle' | 'media' | 'alta';

export interface Zone {
  id: ZoneId;
  name: string;
  alias: string;
}

export interface Point {
  id: string;
  name: string;
  zone: ZoneId;
  level: Level;
  lat: number;
  lon: number;
  altitude: number;
}

export const zones: Zone[] = [
  { id: 'cornion', name: 'Macizo Occidental', alias: 'Cornión' },
  { id: 'urrieles', name: 'Macizo Central', alias: 'Urrieles' },
  { id: 'andara', name: 'Macizo Oriental', alias: 'Ándara' },
  { id: 'valles', name: 'Valles de acceso', alias: 'Valles' },
];

export const points: Point[] = [
  // Cornión
  { id: 'lagos', name: 'Lagos de Covadonga', zone: 'cornion', level: 'media', lat: 43.271, lon: -4.9925, altitude: 1070 },
  { id: 'vegarredonda', name: 'Refugio de Vegarredonda', zone: 'cornion', level: 'alta', lat: 43.2344, lon: -4.9929, altitude: 1460 },

  // Urrieles
  { id: 'bulnes', name: 'Bulnes', zone: 'urrieles', level: 'valle', lat: 43.2351, lon: -4.8201, altitude: 655 },
  { id: 'sotres', name: 'Sotres', zone: 'urrieles', level: 'media', lat: 43.233, lon: -4.749, altitude: 1047 },
  { id: 'urriellu', name: 'Refugio de Urriellu', zone: 'urrieles', level: 'alta', lat: 43.2027, lon: -4.8213, altitude: 1953 },
  { id: 'fuente-de', name: 'Fuente Dé', zone: 'urrieles', level: 'media', lat: 43.1452, lon: -4.8105, altitude: 1078 },
  { id: 'el-cable', name: 'El Cable (teleférico)', zone: 'urrieles', level: 'alta', lat: 43.161, lon: -4.802, altitude: 1834 },

  // Ándara
  { id: 'tresviso', name: 'Tresviso', zone: 'andara', level: 'media', lat: 43.2575, lon: -4.6677, altitude: 886 },
  { id: 'aliva', name: 'Áliva', zone: 'andara', level: 'alta', lat: 43.176, lon: -4.76, altitude: 1667 },

  // Valles de acceso
  { id: 'cangas', name: 'Cangas de Onís', zone: 'valles', level: 'valle', lat: 43.3514, lon: -5.1292, altitude: 60 },
  { id: 'arenas', name: 'Arenas de Cabrales', zone: 'valles', level: 'valle', lat: 43.3039, lon: -4.8157, altitude: 147 },
  { id: 'potes', name: 'Potes', zone: 'valles', level: 'valle', lat: 43.1546, lon: -4.6206, altitude: 291 },
  { id: 'posada', name: 'Posada de Valdeón', zone: 'valles', level: 'valle', lat: 43.1515, lon: -4.921, altitude: 914 },
];

export const pointsByZone = (zone: ZoneId) => points.filter((p) => p.zone === zone);

export const levelLabel: Record<Level, string> = {
  valle: 'Valle',
  media: 'Media montaña',
  alta: 'Alta montaña',
};
