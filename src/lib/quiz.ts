import type {
  DimensionSummary,
  Personality,
  Question,
  QuizSession,
  ScoreVector,
  TestPack,
} from './types';

export function createZeroVector(dimensions: string[]): ScoreVector {
  return Object.fromEntries(dimensions.map((dimension) => [dimension, 0]));
}

export function scoreAnswers(questions: Question[], answerIds: string[], dimensions: string[]) {
  return questions.reduce((vector, question, index) => {
    const pickedId = answerIds[index];
    const option = question.options.find((candidate) => candidate.id === pickedId);
    if (!option) return vector;

    for (const dimension of dimensions) {
      vector[dimension] += option.weights[dimension] ?? 0;
    }

    return vector;
  }, createZeroVector(dimensions));
}

export function cosineSimilarity(a: ScoreVector, b: ScoreVector) {
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;

  for (const key of keys) {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    dot += av * bv;
    aNorm += av * av;
    bNorm += bv * bv;
  }

  if (aNorm === 0 || bNorm === 0) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

function matchesHiddenRule(personality: Personality, vector: ScoreVector) {
  if (!personality.hiddenRule) return false;

  if (personality.hiddenRule.mode === 'all-range') {
    return Object.entries(personality.hiddenRule.dimensions ?? {}).every(
      ([key, [min, max]]) => {
        const value = vector[key] ?? 0;
        return value >= min && value <= max;
      },
    );
  }

  if (personality.hiddenRule.mode === 'min-threshold') {
    const threshold = personality.hiddenRule.threshold ?? 0;
    return Object.values(vector).every((value) => value >= threshold);
  }

  return false;
}

export function resolveResult(pack: TestPack, answers: string[]) {
  const vector = scoreAnswers(pack.questions, answers, pack.meta.dimensions);
  const hidden = pack.personalities.find((personality) => matchesHiddenRule(personality, vector));

  if (hidden) {
    return {
      vector,
      result: hidden,
    };
  }

  const ranked = [...pack.personalities]
    .filter((personality) => !personality.hiddenRule)
    .map((personality) => ({
      personality,
      similarity: cosineSimilarity(vector, personality.targetVector),
    }))
    .sort((left, right) => right.similarity - left.similarity);

  return {
    vector,
    result: ranked[0]?.personality ?? pack.personalities[0],
  };
}

export function summarizeDimensions(pack: TestPack, vector: ScoreVector): DimensionSummary[] {
  return pack.meta.dimensionDetails.map((detail) => {
    const maxMagnitude = Math.max(
      1,
      ...pack.questions.flatMap((question) =>
        question.options.map((option) => Math.abs(option.weights[detail.key] ?? 0)),
      ),
    );
    const totalPossible = Math.max(1, maxMagnitude * pack.questions.length);
    const score = Math.round(((vector[detail.key] ?? 0) / totalPossible) * 100);

    return {
      key: detail.key,
      title: detail.title,
      leftLabel: detail.leftLabel,
      rightLabel: detail.rightLabel,
      score,
    };
  });
}

export function createEmptySession(): QuizSession {
  return {
    started: false,
    currentIndex: 0,
    answers: [],
  };
}
