import { z } from 'zod';
import categoriesJson from '../../content/registry/categories.json';
import testsJson from '../../content/registry/tests.json';
import type {
  Category,
  Personality,
  Question,
  RegistryTest,
  TestMeta,
  TestPack,
} from './types';

const weightSchema = z.record(z.string(), z.number());

const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  theme: z.object({
    accent: z.string(),
    accentSoft: z.string(),
    surface: z.string(),
    ink: z.string(),
  }),
  liveTestIds: z.array(z.string()),
  upcomingTestIds: z.array(z.string()),
});

const registryTestSchema = z.object({
  id: z.string(),
  slug: z.string(),
  category: z.string(),
  status: z.enum(['live', 'upcoming']),
  title: z.string(),
  teaser: z.string(),
  questionCount: z.number(),
});

const methodologySchema = z.object({
  inspiration: z.array(z.string()).min(1),
  scoring: z.string(),
  disclaimer: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  context: z.string().optional(),
  options: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      hint: z.string().optional(),
      weights: weightSchema,
    }),
  ),
});

const personalitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  badge: z.string(),
  vibe: z.string(),
  summary: z.string(),
  whyItHits: z.string(),
  dimensionRead: z.array(z.string()),
  recommendationIds: z.array(z.string()).optional(),
  targetVector: weightSchema,
  hiddenRule: z
    .object({
      mode: z.enum(['all-range', 'min-threshold']),
      dimensions: z.record(z.string(), z.tuple([z.number(), z.number()])).optional(),
      threshold: z.number().optional(),
      keys: z.array(z.string()).optional(),
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
  questionCount: z.number(),
  dimensions: z.array(z.string()),
  dimensionDetails: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      leftLabel: z.string(),
      rightLabel: z.string(),
    }),
  ),
  methodology: methodologySchema,
  recommendationIds: z.array(z.string()),
});

export const categories = z.array(categorySchema).parse(categoriesJson) as Category[];
export const registryTests = z
  .array(registryTestSchema)
  .parse(testsJson) as RegistryTest[];

const metaModules = import.meta.glob('../../content/tests/*/meta.json', { eager: true });
const questionModules = import.meta.glob('../../content/tests/*/questions.json', { eager: true });
const personalityModules = import.meta.glob('../../content/tests/*/personalities.json', { eager: true });

function createPack(meta: unknown, questions: unknown, personalities: unknown): TestPack {
  return {
    meta: metaSchema.parse(meta) as TestMeta,
    questions: z.array(questionSchema).parse(questions) as Question[],
    personalities: z.array(personalitySchema).parse(personalities) as Personality[],
  };
}

function moduleValue(module: unknown) {
  return (module as { default?: unknown }).default ?? module;
}

function getSlugFromPath(path: string) {
  const match = path.match(/content\/tests\/([^/]+)\//);
  if (!match) {
    throw new Error(`Unable to derive test slug from ${path}`);
  }

  return match[1];
}

const packSlugs = Array.from(
  new Set([
    ...Object.keys(metaModules).map(getSlugFromPath),
    ...Object.keys(questionModules).map(getSlugFromPath),
    ...Object.keys(personalityModules).map(getSlugFromPath),
  ]),
);

export const testPacks: Record<string, TestPack> = Object.fromEntries(
  packSlugs.map((slug) => {
    const metaKey = Object.keys(metaModules).find((key) => getSlugFromPath(key) === slug);
    const questionKey = Object.keys(questionModules).find((key) => getSlugFromPath(key) === slug);
    const personalityKey = Object.keys(personalityModules).find((key) => getSlugFromPath(key) === slug);

    if (!metaKey || !questionKey || !personalityKey) {
      throw new Error(`Incomplete content pack for "${slug}".`);
    }

    return [
      slug,
      createPack(
        moduleValue(metaModules[metaKey]),
        moduleValue(questionModules[questionKey]),
        moduleValue(personalityModules[personalityKey]),
      ),
    ];
  }),
);

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getTestBySlug(slug: string) {
  return registryTests.find((test) => test.slug === slug);
}

export function getPackBySlug(slug: string) {
  return testPacks[slug];
}

export function getTestsForCategory(categoryId: string) {
  return registryTests.filter((test) => test.category === categoryId);
}

export function getPackPreviewById(id: string) {
  const pack = testPacks[id];
  if (!pack) return undefined;
  return pack;
}
