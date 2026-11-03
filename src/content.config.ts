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

export const collections = { boletines };
