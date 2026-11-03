import type { APIRoute } from 'astro';
import { getBulletins } from '../lib/bulletins';

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const bulletins = await getBulletins();
  const urls = [
    { path: '/', lastmod: undefined },
    { path: '/mapa/', lastmod: undefined },
    { path: '/boletin/', lastmod: bulletins[0]?.data.date },
    ...bulletins.map((b) => ({ path: `/boletin/${b.id}/`, lastmod: b.data.date })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, lastmod }) =>
      `  <url><loc>${new URL(base + path, site)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
