// Tabla de previsión de 3 días para la ficha de una cumbre o ruta.
import { getSpotForecast, type Spot } from './forecast';
import { wmo } from './wmo';

const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: 'UTC' });
const m = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 0 });
const r = Math.round;

export async function renderSpotForecast(target: HTMLElement, spot: Spot) {
  target.innerHTML = '<p class="muted">Cargando previsión…</p>';
  try {
    const days = await getSpotForecast(spot);
    const rows = days
      .map((d, i) => {
        const w = wmo(d.code);
        const label = i === 0 ? 'Hoy' : weekday.format(new Date(`${d.date}T12:00:00Z`));
        return `<tr>
          <th scope="row">${label}</th>
          <td><span role="img" aria-label="${w.label}" title="${w.label}">${w.icon}</span></td>
          <td><b>${r(d.tMax)}°</b>/${r(d.tMin)}°</td>
          <td class="pp">${d.precipProb}%</td>
          <td>${r(d.gust)} km/h</td>
          <td>${d.snow >= 0.5 ? `❄ ${r(d.snow)} cm` : '—'}</td>
          <td>${d.freezingLevel == null ? '—' : `${m.format(r(d.freezingLevel / 100) * 100)} m`}</td>
        </tr>`;
      })
      .join('');
    target.innerHTML = `<table class="spot-fc">
      <thead><tr><th></th><th></th><th>Máx/mín</th><th>Precip.</th><th>Rachas</th><th>Nieve</th><th>Iso 0°</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="muted fc-note">Open-Meteo a ${m.format(spot.altitude)} m. En crestas el viento suele ser más fuerte que el modelado.</p>`;
  } catch (err) {
    console.error(err);
    target.innerHTML = '<p class="muted">No se ha podido cargar la previsión.</p>';
  }
}
