import type { Locale } from './locale';
import type { DimensionSummary, Personality } from './types';

export type LbtiReportDimension = {
  key: string;
  title: string;
  code: string;
  score: number;
  band: 'H' | 'M' | 'L';
  points: 3 | 4 | 5;
  description: string;
};

const REPORT_META: Record<string, { code: string; positive: string; neutral: string; low: string }> = {
  attunement: {
    code: 'L1',
    positive: '对回应和关系温度更敏感，掉一点线都会很快被你捕捉到。',
    neutral: '会看回应，但不会只靠一两次波动就把整段关系判死刑。',
    low: '对回应节奏相对松弛，不太会把联系频率直接等同于关系存亡。',
  },
  signal: {
    code: 'L2',
    positive: '有感觉时更愿意把信号放出来，不太爱长期装没事。',
    neutral: '会表达，但也会观察风向，不会一路把自己推到最前面。',
    low: '更容易把喜欢藏在动作和暗示里，嘴上通常不会先认。',
  },
  repair: {
    code: 'L3',
    positive: '问题一出现就更想修，不太接受关系一直烂在那里。',
    neutral: '会看场面和时机，再决定现在修还是晚一点修。',
    low: '更需要先退开降温，情绪一高时不会立刻处理关系问题。',
  },
  boundary: {
    code: 'L4',
    positive: '边界感更强，亲密关系也需要给你保留清楚的呼吸口。',
    neutral: '会在亲近和独处之间找平衡，不太吃极端黏或极端冷。',
    low: '更吃陪伴和高连接，关系一松下来会更容易没底。',
  },
  certainty: {
    code: 'L5',
    positive: '比较在意站位、承诺和清晰说法，不喜欢长期模糊地往前走。',
    neutral: '可以接受一段时间的自然推进，但迟早还是想知道方向。',
    low: '不太急着给关系贴标签，更看重相处本身是不是真的顺。',
  },
  retreat: {
    code: 'L6',
    positive: '一旦感觉失衡，你会更快把热度往回收，先保护自己。',
    neutral: '会边看边退，也会边退边观察，不会一下子完全抽走。',
    low: '哪怕关系出问题，你也更倾向留在现场继续谈，不太爱突然下线。',
  },
};

const REPORT_META_EN: Record<string, { code: string; positive: string; neutral: string; low: string }> = {
  attunement: {
    code: 'L1',
    positive: 'You are highly sensitive to response and relationship temperature; even small drops get noticed fast.',
    neutral: 'You read responses, but one or two fluctuations will not make you condemn the whole relationship.',
    low: 'You are relatively relaxed about response rhythm and do not equate contact frequency with relationship survival.',
  },
  signal: {
    code: 'L2',
    positive: 'When you feel something, you are more willing to send the signal instead of pretending for too long.',
    neutral: 'You can express yourself, but still read the room before stepping forward.',
    low: 'You are more likely to hide affection in actions and hints before admitting it verbally.',
  },
  repair: {
    code: 'L3',
    positive: 'When a problem appears, you want to repair it rather than leave the relationship rotting there.',
    neutral: 'You watch the timing and situation before deciding whether to repair now or later.',
    low: 'You need to step back and cool down first; high emotion makes immediate repair hard.',
  },
  boundary: {
    code: 'L4',
    positive: 'Your boundaries are strong, and even intimacy needs a clear breathing space.',
    neutral: 'You look for balance between closeness and alone time, avoiding both extremes.',
    low: 'You lean toward companionship and high connection; looseness can make you feel unsafe.',
  },
  certainty: {
    code: 'L5',
    positive: 'You care about position, commitment, and clarity, and dislike walking forward in long-term blur.',
    neutral: 'You can accept organic progress for a while, but eventually need to know the direction.',
    low: 'You are not rushed to label the relationship and care more about whether the actual interaction feels right.',
  },
  retreat: {
    code: 'L6',
    positive: 'When imbalance appears, you pull warmth back faster to protect yourself first.',
    neutral: 'You observe while stepping back and do not withdraw completely all at once.',
    low: 'Even when problems appear, you are more likely to stay in the scene and keep talking.',
  },
};

function toBand(score: number): { band: 'H' | 'M' | 'L'; points: 3 | 4 | 5 } {
  if (score >= 35) return { band: 'H', points: 5 };
  if (score <= -35) return { band: 'L', points: 3 };
  return { band: 'M', points: 4 };
}

export function buildLbtiReport(dimensions: DimensionSummary[], result: Personality, locale: Locale = 'zh') {
  const reportMeta = locale === 'en' ? REPORT_META_EN : REPORT_META;
  const scoreMap = Object.fromEntries(dimensions.map((dimension) => [dimension.key, dimension.score]));
  const matchedCount = dimensions.filter((dimension) => {
    const target = result.targetVector[dimension.key] ?? 0;
    return (target >= 0 && dimension.score >= 0) || (target < 0 && dimension.score < 0);
  }).length;

  const items: LbtiReportDimension[] = dimensions.map((dimension) => {
    const meta = reportMeta[dimension.key];
    const { band, points } = toBand(dimension.score);
    return {
      key: dimension.key,
      title: dimension.title,
      code: meta?.code ?? dimension.key.toUpperCase(),
      score: dimension.score,
      band,
      points,
      description:
        band === 'H'
          ? meta?.positive ?? dimension.rightLabel
          : band === 'L'
            ? meta?.low ?? dimension.leftLabel
            : meta?.neutral ?? (locale === 'en'
              ? `Falls near the middle between ${dimension.leftLabel} and ${dimension.rightLabel}.`
              : `${dimension.leftLabel} 与 ${dimension.rightLabel} 之间更偏中段。`),
    };
  });

  const verdict =
    matchedCount >= 5
      ? locale === 'en'
        ? 'The six dimensions align strongly, so this can be treated as your primary love profile.'
        : '六个维度命中度较高，当前结果可视为你的第一人格画像。'
      : matchedCount >= 4
        ? locale === 'en'
          ? 'The six dimensions mostly align, so this is your dominant relationship tendency.'
          : '六个维度大体对齐，当前结果可视为你的主导人格倾向。'
        : locale === 'en'
          ? 'This result is a current-stage profile. Read the full archive for more nuance.'
          : '当前结果可以视为你的阶段性画像，建议结合完整详情页继续看。';

  return {
    matchedCount,
    total: dimensions.length,
    verdict,
    items,
  };
}
