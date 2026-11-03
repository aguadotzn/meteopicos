import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Boletines en src/content/boletines/AAAA-MM-DD.md
// `draft: true` los excluye del build hasta que estén revisados.
const boletines = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/boletines' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    number: z.number().int().positive(),
    summary: z.string(),
    next: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

// Rutas de esquí de montaña en src/content/rutas/<id>.md
// Salida y cima con coordenadas y altitud de OpenStreetMap. Sin trazado GPS.
const place = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  altitude: z.number().int(),
});

const rutas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rutas' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['cima', 'circular', 'travesia']),
    massif: z.enum(['cornion', 'urrieles', 'andara']),
    start: place,
    summit: place,
    ascent: z.number().int().positive(),
    difficulty: z.string().nullish(),
    orientation: z.string().nullish(),
    season: z.string().nullish(),
    access: z.string().nullish(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { boletines, rutas };
