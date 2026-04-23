import { describe, expect, it } from 'vitest';
import { registryTests, testPacks } from '@/lib/content';
import { cosineSimilarity, resolveResult, scoreAnswers, summarizeDimensions } from '@/lib/quiz';
import type { TestPack } from '@/lib/types';

const demoPack: TestPack = {
  meta: {
    id: 'demo',
    slug: 'demo',
    category: 'work',
    status: 'live',
    title: 'Demo',
    hook: 'Demo',
    summary: 'Demo',
    seoTitle: 'Demo',
    seoDescription: 'Demo',
    posterTheme: 'demo',
    accentLabel: 'Demo',
    durationLabel: '1 min',
    questionCount: 2,
    dimensions: ['energy', 'order'],
    dimensionDetails: [
      { key: 'energy', title: 'Energy', leftLabel: 'low', rightLabel: 'high' },
      { key: 'order', title: 'Order', leftLabel: 'loose', rightLabel: 'strict' },
    ],
    methodology: {
      inspiration: ['Demo inspiration'],
      scoring: 'Weighted vector matching',
      disclaimer: 'Demo disclaimer',
    },
    recommendationIds: [],
  },
  questions: [
    {
      id: 'q1',
      prompt: 'Q1',
      options: [
        { id: 'a', label: 'A', weights: { energy: 2, order: 1 } },
        { id: 'b', label: 'B', weights: { energy: -2, order: -1 } },
      ],
    },
    {
      id: 'q2',
      prompt: 'Q2',
      options: [
        { id: 'a', label: 'A', weights: { energy: 2, order: 1 } },
        { id: 'b', label: 'B', weights: { energy: -2, order: -1 } },
      ],
    },
  ],
  personalities: [
    {
      id: 'spark',
      slug: 'spark',
      name: 'Spark',
      badge: 'Live wire',
      vibe: 'High-output mode',
      summary: 'Spark summary',
      whyItHits: 'Spark why',
      dimensionRead: ['Fast', 'Loud', 'Pushes'],
      targetVector: { energy: 0.95, order: 0.35 },
    },
    {
      id: 'drift',
      slug: 'drift',
      name: 'Drift',
      badge: 'Low signal',
      vibe: 'Low-output mode',
      summary: 'Drift summary',
      whyItHits: 'Drift why',
      dimensionRead: ['Slow', 'Quiet', 'Avoids'],
      targetVector: { energy: -0.95, order: -0.35 },
    },
    {
      id: 'center',
      slug: 'center',
      name: 'Center',
      badge: 'Hidden type',
      vibe: 'Balanced mode',
      summary: 'Center summary',
      whyItHits: 'Center why',
      dimensionRead: ['Balanced', 'Measured', 'Neutral'],
      targetVector: { energy: 0, order: 0 },
      hiddenRule: {
        mode: 'all-range',
        dimensions: {
          energy: [-0.5, 0.5],
          order: [-0.5, 0.5],
        },
      },
    },
  ],
};

describe('quiz engine', () => {
  it('accumulates weighted answers into a score vector', () => {
    expect(
      scoreAnswers(demoPack.questions, ['a', 'b'], demoPack.meta.dimensions),
    ).toEqual({
      energy: 0,
      order: 0,
    });
  });

  it('computes cosine similarity and handles orthogonal/zero vectors', () => {
    expect(cosineSimilarity({ a: 1, b: 1 }, { a: 2, b: 2 })).toBeCloseTo(1, 6);
    expect(cosineSimilarity({ a: 0, b: 0 }, { a: 2, b: 2 })).toBe(0);
  });

  it('returns a hidden result when its trigger range is matched', () => {
    const resolved = resolveResult(demoPack, ['a', 'b']);
    expect(resolved.result.name).toBe('Center');
  });

  it('returns the nearest visible result when no hidden rule is triggered', () => {
    const resolved = resolveResult(demoPack, ['a', 'a']);
    expect(resolved.result.name).toBe('Spark');
  });

  it('summarizes dimension balance for result meters', () => {
    const dimensions = summarizeDimensions(demoPack, { energy: 2, order: -2 });
    expect(dimensions).toEqual([
      {
        key: 'energy',
        title: 'Energy',
        leftLabel: 'low',
        rightLabel: 'high',
        score: 50,
      },
      {
        key: 'order',
        title: 'Order',
        leftLabel: 'loose',
        rightLabel: 'strict',
        score: -100,
      },
    ]);
  });
});

describe('content registry', () => {
  it('loads the live matrix packs without hardcoding a single test', () => {
    const liveSlugs = registryTests
      .filter((entry) => entry.status === 'live')
      .map((entry) => entry.slug)
      .sort();

    expect(liveSlugs).toEqual(['lbti']);
    expect(Object.keys(testPacks).sort()).toEqual(['lbti']);
  });
});
