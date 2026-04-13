import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

const weightSchema = z.record(z.string(), z.number());

const optionSchema = z.object({
  id: z.string(),
  label: z.string(),
  hint: z.string().optional(),
  weights: weightSchema,
});

const questionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  context: z.string().optional(),
  options: z.array(optionSchema).min(2),
});

const personalitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  group: z.string().optional(),
  name: z.string(),
  badge: z.string(),
  vibe: z.string(),
  summary: z.string(),
  whyItHits: z.string(),
  dimensionRead: z.array(z.string()).min(3),
  sweetSpot: z.string().optional(),
  stressSignal: z.string().optional(),
  repairTip: z.string().optional(),
  recommendationIds: z.array(z.string()).optional(),
  targetVector: weightSchema,
  hiddenRule: z
    .object({
      mode: z.enum(['all-range', 'min-threshold', 'answer-pattern']),
      dimensions: z.record(z.string(), z.tuple([z.number(), z.number()])).optional(),
      threshold: z.number().optional(),
      keys: z.array(z.string()).optional(),
      answers: z
        .array(
          z.object({
            questionId: z.string(),
            optionIds: z.array(z.string()).min(1),
          }),
        )
        .optional(),
    })
    .optional(),
});

const metaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  category: z.string(),
  status: z.enum(['live', 'upcoming']),
  title: z.string(),
  hook: z.string(),
  summary: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  posterTheme: z.string(),
  accentLabel: z.string(),
  durationLabel: z.string(),
  questionCount: z.number().int().positive(),
  dimensions: z.array(z.string()).min(3),
  dimensionDetails: z
    .array(
      z.object({
        key: z.string(),
        title: z.string(),
        leftLabel: z.string(),
        rightLabel: z.string(),
      }),
    )
    .min(3),
  methodology: z.object({
    inspiration: z.array(z.string()).min(1),
    scoring: z.string(),
    disclaimer: z.string(),
  }),
  recommendationIds: z.array(z.string()).min(1),
});

async function readJson(file) {
  const raw = await readFile(resolve(process.cwd(), file), 'utf8');
  return JSON.parse(raw);
}

const registry = await readJson('content/registry/tests.json');
const tests = registry
  .filter((entry) => entry.status === 'live')
  .map((entry) => entry.slug);

for (const slug of tests) {
  const questions = await readJson(`content/tests/${slug}/questions.json`);
  const personalities = await readJson(`content/tests/${slug}/personalities.json`);
  const meta = await readJson(`content/tests/${slug}/meta.json`);

  z.array(questionSchema).min(6).parse(questions);
  z.array(personalitySchema).min(4).parse(personalities);
  metaSchema.parse(meta);
}

console.log(`Validated ${tests.length} test packs.`);
