import { getCollection } from 'astro:content';

export async function getBulletins() {
  // En desarrollo (npm run dev) se ven también los borradores para revisarlos.
  const all = await getCollection('boletines', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const longDate = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Madrid',
});

// Rutas de esquí: en desarrollo también los borradores.
export async function getRoutes() {
  const all = await getCollection('rutas', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.ascent - a.data.ascent);
}
