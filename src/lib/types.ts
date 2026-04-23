export type Theme = {
  accent: string;
  accentSoft: string;
  surface: string;
  ink: string;
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  theme: Theme;
  liveTestIds: string[];
  upcomingTestIds: string[];
};

export type RegistryTest = {
  id: string;
  slug: string;
  category: string;
  status: 'live' | 'upcoming';
  title: string;
  teaser: string;
  questionCount: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  hint?: string;
  weights: Record<string, number>;
};

export type Question = {
  id: string;
  prompt: string;
  context?: string;
  options: QuestionOption[];
};

export type HiddenRuleAnswerPattern = {
  questionId: string;
  optionIds: string[];
};

export type HiddenRule = {
  mode: 'all-range' | 'min-threshold' | 'answer-pattern';
  dimensions?: Record<string, [number, number]>;
  threshold?: number;
  keys?: string[];
  answers?: HiddenRuleAnswerPattern[];
};

export type Personality = {
  id: string;
  slug: string;
  group?: string;
  name: string;
  badge: string;
  vibe: string;
  summary: string;
  whyItHits: string;
  dimensionRead: string[];
  sweetSpot?: string;
  stressSignal?: string;
  repairTip?: string;
  recommendationIds?: string[];
  targetVector: Record<string, number>;
  hiddenRule?: HiddenRule;
};

export type DimensionDetail = {
  key: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
  scienceTag?: string;
  coverage?: string;
  sourceIds?: string[];
};

export type SourceReference = {
  id: string;
  title: string;
  citation?: string;
  publisher: string;
  url: string;
  takeaway: string;
  appliesTo: string[];
};

export type QuestionPrinciple = {
  key: string;
  title: string;
  text: string;
  sourceIds: string[];
};

export type TestMeta = {
  id: string;
  slug: string;
  category: string;
  status: 'live' | 'upcoming';
  title: string;
  hook: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  posterTheme: string;
  accentLabel: string;
  durationLabel: string;
  questionCount: number;
  dimensions: string[];
  dimensionDetails: DimensionDetail[];
  methodology: {
    inspiration: string[];
    scoring: string;
    disclaimer: string;
    questionPrinciples?: QuestionPrinciple[];
    sources?: SourceReference[];
  };
  recommendationIds: string[];
};

export type TestPack = {
  meta: TestMeta;
  questions: Question[];
  personalities: Personality[];
};

export type ScoreVector = Record<string, number>;

export type RankedResult = {
  personality: Personality;
  similarity: number;
  match: number;
};

export type DimensionSummary = {
  key: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
  score: number;
};

export type QuizSession = {
  started: boolean;
  currentIndex: number;
  answers: string[];
  resultId?: string;
};

export type ResolvedQuizResult = {
  vector: ScoreVector;
  result: Personality;
  match: number;
  ranked: RankedResult[];
};
