import type {
  DimensionSummary,
  Personality,
  Question,
  RankedResult,
  ResolvedQuizResult,
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

/**
 * Computes cosine similarity between two score vectors.
 * Both vectors are unit-normalized before dot product,
 * eliminating magnitude bias and ensuring only directional similarity matters.
 */
export function cosineSimilarity(a: ScoreVector, b: ScoreVector) {
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));

  const aVec = keys.map((key) => a[key] ?? 0);
  const bVec = keys.map((key) => b[key] ?? 0);

  const aNorm = Math.sqrt(aVec.reduce((s, v) => s + v * v, 0));
  const bNorm = Math.sqrt(bVec.reduce((s, v) => s + v * v, 0));

  if (aNorm === 0 || bNorm === 0) return 0;

  const aNormed = aVec.map((v) => v / aNorm);
  const bNormed = bVec.map((v) => v / bNorm);

  return Math.max(
    -1,
    Math.min(1, aNormed.reduce((s, av, i) => s + av * bNormed[i], 0)),
  );
}

function matchesDimensionRanges(personality: Personality, vector: ScoreVector) {
  if (!personality.hiddenRule?.dimensions) return true;

  return Object.entries(personality.hiddenRule.dimensions).every(([key, [min, max]]) => {
    const value = vector[key] ?? 0;
    return value >= min && value <= max;
  });
}

function matchesHiddenRule(
  personality: Personality,
  vector: ScoreVector,
  questions: Question[],
  answers: string[],
) {
  if (!personality.hiddenRule) return false;

  if (personality.hiddenRule.mode === 'all-range') {
    return matchesDimensionRanges(personality, vector);
  }

  if (personality.hiddenRule.mode === 'min-threshold') {
    const threshold = personality.hiddenRule.threshold ?? 0;
    return Object.values(vector).every((value) => value >= threshold);
  }

  if (personality.hiddenRule.mode === 'answer-pattern') {
    const answerLookup = Object.fromEntries(
      questions.map((question, index) => [question.id, answers[index]]),
    );
    const minimumMatches = personality.hiddenRule.threshold ?? 1;
    const matchedCount = (personality.hiddenRule.answers ?? []).filter((pattern) =>
      pattern.optionIds.includes(answerLookup[pattern.questionId]),
    ).length;

    return matchesDimensionRanges(personality, vector) && matchedCount >= minimumMatches;
  }

  return false;
}

const SOFTMAX_TEMP = 1.0;

export function resolveResult(pack: TestPack, answers: string[]): ResolvedQuizResult {
  const vector = scoreAnswers(pack.questions, answers, pack.meta.dimensions);

  // Hidden rule personalities are matched first via exact dimension criteria
  const hidden = pack.personalities.find((personality) =>
    matchesHiddenRule(personality, vector, pack.questions, answers),
  );

  if (hidden) {
    return {
      vector,
      result: hidden,
      match: 90,
      ranked: [],
    };
  }

  // Normal cosine similarity between user vector and personality target vectors
  const similarities = pack.personalities
    .filter((p) => !p.hiddenRule)
    .map((p) => ({
      personality: p,
      similarity: cosineSimilarity(vector, p.targetVector),
    }))
    .sort((a, b) => b.similarity - a.similarity);

  // Compute softmax probabilities
  const weights = similarities.map(({ similarity }) =>
    Math.exp(similarity / SOFTMAX_TEMP),
  );
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const probabilities = weights.map((w) => w / totalWeight);

  // Weighted random selection using softmax probabilities
  const rand = Math.random();
  let cumProb = 0;
  let selectedIndex = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumProb += probabilities[i];
    if (rand < cumProb) {
      selectedIndex = i;
      break;
    }
  }

  const ranked: RankedResult[] = similarities.map(({ personality, similarity }, index) => ({
    personality,
    similarity,
    match: Math.round(probabilities[index] * 100),
  }));

  return {
    vector,
    result: similarities[selectedIndex].personality,
    match: Math.round(probabilities[selectedIndex] * 100),
    ranked,
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
