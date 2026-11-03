// Genera un borrador de boletín con los datos actuales de Open-Meteo.
// Uso: npm run boletin:borrador
// Crea src/content/boletines/AAAA-MM-DD.md con `draft: true`: revísalo, completa
// la situación general y cambia a `draft: false` para publicarlo.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { points, zones, type ZoneId } from '../src/data/zones.ts';
import { getForecast, summarize, type Day, type PointForecast } from '../src/lib/forecast.ts';
import { wmo } from '../src/lib/wmo.ts';

const DIR = join(import.meta.dirname, '../src/content/boletines');
const NEXT_IN_DAYS = 3;

const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', timeZone: 'UTC' });
const short = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
const m = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 0 });
const asDate = (iso: string) => new Date(`${iso}T12:00:00Z`);
const r = Math.round;
const meters = (v: number | null) => (v == null ? '—' : `${m.format(r(v / 100) * 100)} m`);

function lastNumber(): number {
  if (!existsSync(DIR)) return 0;
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => Number(readFileSync(join(DIR, f), 'utf8').match(/^number:\s*(\d+)/m)?.[1] ?? 0))
    .reduce((a, b) => Math.max(a, b), 0);
}

function range(values: number[], unit = '') {
  const lo = r(Math.min(...values));
  const hi = r(Math.max(...values));
  return lo === hi ? `${lo}${unit}` : `${lo} a ${hi}${unit}`;
}

function dayText(j: number, byZone: Record<ZoneId, PointForecast[]>, all: Day[]) {
  const valleys = byZone.valles.map((p) => p.days[j]);
  const high = points
    .map((p, i) => ({ p, d: forecastPoints[i].days[j] }))
    .filter(({ p }) => p.level === 'alta');
  const v = summarize(byZone.valles)[j];
  const lines = [
    `**${wmo(v.code).label}** en los valles, con probabilidad de precipitación del ${range(valleys.map((d) => d.precipProb), ' %')}.`,
    `Máximas de ${range(valleys.map((d) => d.tMax), ' °C')} y mínimas de ${range(valleys.map((d) => d.tMin), ' °C')} en los valles.`,
    `En cotas altas (${high.map(({ p }) => p.name).join(', ')}): máximas de ${range(high.map(({ d }) => d.tMax), ' °C')} y mínimas de ${range(high.map(({ d }) => d.tMin), ' °C')}.`,
    `Isoterma de 0 °C en torno a ${meters(all[j].freezingLevel)}.`,
  ];
  const snow = high.filter(({ d }) => d.snow >= 0.5);
  if (snow.length) lines.push(`Nieve prevista: ${snow.map(({ p, d }) => `${r(d.snow)} cm en ${p.name}`).join(', ')}.`);
  const gust = Math.max(...forecastPoints.map((p) => p.days[j].gust));
  if (gust >= 50) lines.push(`Rachas de hasta ${r(gust)} km/h en zonas expuestas.`);
  return lines.join(' ');
}

function zoneTable(group: PointForecast[], days: Day[]) {
  const head = `| Punto | ${days.map((d) => short.format(asDate(d.date))).join(' | ')} |`;
  const sep = `|---|${days.map(() => '---').join('|')}|`;
  const rows = group.map(
    (pf) =>
      `| ${pf.point.name} (${m.format(pf.point.altitude)} m) | ${pf.days
        .slice(0, days.length)
        .map((d) => `${wmo(d.code).icon} ${r(d.tMax)}/${r(d.tMin)} °C · ${d.precipProb} %`)
        .join(' | ')} |`,
  );
  return [head, sep, ...rows].join('\n');
}

const forecast = await getForecast(points);
const forecastPoints = forecast.points;
const byZone = Object.fromEntries(zones.map((z) => [z.id, forecastPoints.filter((p) => p.point.zone === z.id)])) as Record<
  ZoneId,
  PointForecast[]
>;
const all = summarize(forecastPoints);
const days = all.slice(0, 4);

const today = days[0].date;
const next = new Date(asDate(today).getTime() + NEXT_IN_DAYS * 864e5).toISOString().slice(0, 10);
const file = join(DIR, `${today}.md`);
if (existsSync(file)) {
  console.error(`Ya existe ${file}. Bórralo o renómbralo si quieres regenerarlo.`);
  process.exit(1);
}

const valleyToday = summarize(byZone.valles)[0];
const md = `---
title: "TODO: titular del boletín"
date: ${today}
number: ${lastNumber() + 1}
summary: "TODO: una o dos frases. Hoy, ${wmo(valleyToday.code).label.toLowerCase()} en los valles con máximas de ${r(valleyToday.tMax)} °C."
next: ${next}
draft: true
---

## Situación general

TODO: describe la situación atmosférica y la evolución de los próximos días. Contrasta con la
[predicción de montaña de AEMET](https://www.aemet.es/es/eltiempo/prediccion/montana?w=&p=peu1)
y [El tiempo de Javimo](https://www.eltiempodejavimo.es/).

## Previsión por días

${days.map((d, j) => `### ${weekday.format(asDate(d.date)).replace(/^./, (c) => c.toUpperCase())}\n\n${dayText(j, byZone, all)}`).join('\n\n')}

## Previsión por zonas

${zones.map((z) => `### ${z.name} (${z.alias})\n\n${zoneTable(byZone[z.id], days)}`).join('\n\n')}

**Isoterma 0 °C:** ${days.map((d) => `${short.format(asDate(d.date))} ~${meters(d.freezingLevel)}`).join(' · ')}

> Datos numéricos de Open-Meteo generados el ${new Date(forecast.fetchedAt).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}. Fuentes: AEMET, Open-Meteo, El tiempo de Javimo.
`;

writeFileSync(file, md);
console.log(`Borrador creado: ${file}`);
