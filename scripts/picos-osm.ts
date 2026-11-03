// Descarga de OpenStreetMap (Overpass) las cumbres de Picos de Europa por encima de MIN_ALT
// y genera src/data/peaks.json.
// Uso: npm run picos:osm
// Datos © colaboradores de OpenStreetMap (ODbL).

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MIN_ALT = 2400;
const BBOX = '43.12,-5.05,43.30,-4.62'; // sur, oeste, norte, este
const OVERPASS = 'https://overpass-api.de/api/interpreter';
const OUT = join(import.meta.dirname, '../src/data/peaks.json');

// Límites aproximados entre macizos: río Cares (oeste) y río Duje (este).
const CARES_LON = -4.9;
const DUJE_LON = -4.76;

interface OsmNode {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

const query = `[out:json][timeout:60];node["natural"="peak"]["name"]["ele"](${BBOX});out body;`;
// Overpass se satura a menudo (502/429): reintenta esperando cada vez el doble.
async function overpass(retries = 4, wait = 15_000): Promise<OsmNode[]> {
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'User-Agent': 'meteopicos (personal project)' },
    body: new URLSearchParams({ data: query }),
  });
  if (res.ok) return ((await res.json()) as { elements: OsmNode[] }).elements;
  if (retries === 0) throw new Error(`Overpass ${res.status}: inténtalo de nuevo en unos minutos`);
  console.log(`Overpass ${res.status}, reintento en ${wait / 1000} s…`);
  await new Promise((r) => setTimeout(r, wait));
  return overpass(retries - 1, wait * 2);
}

const elements = await overpass();

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const massif = (lon: number) => (lon < CARES_LON ? 'cornion' : lon > DUJE_LON ? 'andara' : 'urrieles');

const byName = new Map<string, OsmNode & { ele: number }>();
for (const e of elements) {
  const ele = Math.round(Number(e.tags.ele.replace(',', '.')));
  if (!Number.isFinite(ele) || ele < MIN_ALT) continue;
  // Algunos nombres se repiten (p. ej. dos nodos «La Morra»): se queda el más alto.
  const prev = byName.get(e.tags.name);
  if (!prev || prev.ele < ele) byName.set(e.tags.name, { ...e, ele });
}

const peaks = [...byName.values()]
  .sort((a, b) => b.ele - a.ele)
  .map((e) => ({
    id: slug(e.tags.name),
    name: e.tags.name,
    altName: e.tags.alt_name?.split(';')[0],
    altitude: e.ele,
    lat: Number(e.lat.toFixed(5)),
    lon: Number(e.lon.toFixed(5)),
    massif: massif(e.lon),
    osm: e.id,
    wikidata: e.tags.wikidata,
  }));

writeFileSync(OUT, JSON.stringify(peaks, null, 2) + '\n');
console.log(`${peaks.length} cumbres ≥ ${MIN_ALT} m → ${OUT}`);
