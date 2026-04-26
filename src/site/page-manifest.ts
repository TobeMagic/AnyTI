export type SiteEntryKey =
  | 'about'
  | 'home'
  | 'lbti'
  | 'lbtiMbti'
  | 'notFound'
  | 'rankings'
  | 'startTest'
  | 'typeDetail'
  | 'types';

export type SitePage = {
  appAttrs?: Record<string, string>;
  description?: string;
  entryKey: SiteEntryKey;
  fileName: string;
  name: string;
  themeColor?: string;
  title: string;
};

export const siteEntries: Record<SiteEntryKey, string> = {
  about: 'src/entries/about.tsx',
  home: 'src/entries/home.tsx',
  lbti: 'src/entries/test.tsx',
  lbtiMbti: 'src/entries/cross-analysis.tsx',
  notFound: 'src/entries/not-found.tsx',
  rankings: 'src/entries/rankings.tsx',
  startTest: 'src/entries/start-test.tsx',
  typeDetail: 'src/entries/type-detail.tsx',
  types: 'src/entries/types.tsx',
};

export const lbtiTypeRouteSlugs = [
  'buffer-r',
  'check-r',
  'clue-r',
  'dodge-r',
  'exit-p',
  'load-r',
  'loud-r',
  'plan-r',
  'proof-r',
  'seen-r',
  'step-r',
  'sweet-r',
  'temp-r',
  'truce-x',
  'tsun-r',
  'watch-r',
] as const;

const typeDetailPages: SitePage[] = lbtiTypeRouteSlugs.map((slug) => ({
  description: '查看 LBTI 恋爱人格详情、三面角色和关系行为解析。',
  entryKey: 'typeDetail',
  fileName: `types/${slug}/index.html`,
  name: `type-${slug}`,
  themeColor: '#E2A7BC',
  title: 'LBTI 人格详情',
}));

export const sitePages: SitePage[] = [
  {
    description: 'LBTI 首页：先看恋爱角色图鉴、科学依据和热榜，再进入真正的答题现场。',
    entryKey: 'home',
    fileName: 'index.html',
    name: 'home',
    themeColor: '#E2A7BC',
    title: 'LBTI｜恋爱人格测试首页',
  },
  {
    description: '这个 AnyTI 入口还没接上，回首页重新选择类别或进入已上线测试。',
    entryKey: 'notFound',
    fileName: '404.html',
    name: 'notFound',
    themeColor: '#2D5E83',
    title: '页面未找到｜AnyTI',
  },
  {
    description: '浏览 16 种 LBTI 恋爱人格类型。',
    entryKey: 'types',
    fileName: 'types/index.html',
    name: 'types',
    title: 'LBTI 人格类型｜AnyTI',
  },
  ...typeDetailPages,
  {
    description: '查看 LBTI 恋爱人格排行榜。',
    entryKey: 'rankings',
    fileName: 'rankings/index.html',
    name: 'rankings',
    title: 'LBTI 排行榜｜AnyTI',
  },
  {
    description: '查看 LBTI 恋爱系人格测试的模型与说明。',
    entryKey: 'about',
    fileName: 'about/index.html',
    name: 'about',
    title: '关于 LBTI｜AnyTI',
  },
  {
    description: '查看 LBTI 与 MBTI 的交叉解析。',
    entryKey: 'lbtiMbti',
    fileName: 'lbti-mbti/index.html',
    name: 'lbtiMbti',
    title: 'LBTI × MBTI｜AnyTI',
  },
  {
    description: 'LBTI 沉浸式答题页，直接进入 30 道恋爱场景题。',
    entryKey: 'startTest',
    fileName: 'test/index.html',
    name: 'test',
    title: 'LBTI 答题现场｜恋爱人格测试',
  },
  {
    appAttrs: {
      'data-test-slug': 'lbti',
    },
    description: '通过多维连续谱和余弦匹配，测你在关系里更像秒回幻觉师、浪漫审计员还是体面失联人。',
    entryKey: 'lbti',
    fileName: 'lbti/index.html',
    name: 'lbti',
    themeColor: '#D86A9A',
    title: 'LBTI 恋爱人格测试｜测试主页',
  },
];
