import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getStartTestHref } from '@/lib/routes';

const aboutTiles = [
  {
    icon: '📝',
    zhTitle: '当前题量',
    zhText: '按覆盖需要继续扩展，不预设死数',
    enTitle: 'Current Question Set',
    enText: 'Expanded whenever coverage needs it',
  },
  {
    icon: '🎭',
    zhTitle: '16 种结果',
    zhText: '16 个核心角色 × 3 种展示面',
    enTitle: '16 Results',
    enText: '16 roles with three display faces each',
  },
  {
    icon: '🧪',
    zhTitle: '6 组切面',
    zhText: '6 个关系维度全面覆盖',
    enTitle: '6 Models',
    enText: 'Six relationship dimensions',
  },
  {
    icon: '🪞',
    zhTitle: '三面展示',
    zhText: '同一结果会显示自嘲面、动物面和甜心面',
    enTitle: 'Three Faces',
    enText: 'Each result can be viewed through three display faces',
  },
];

const aboutNotes = [
  {
    icon: '🪞',
    zhTitle: '先从具体关系场景出发',
    zhText: '题目全部来自回消息、临时改约、冷战、确认关系、分手收尾这些真实互动，不用空泛的形容词硬给你贴标签。',
    enTitle: 'Starts from real situations',
    enText: 'Every item comes from actual relationship moments instead of abstract personality adjectives.',
  },
  {
    icon: '📈',
    zhTitle: '不是二选一，而是连续落点',
    zhText: '每一道题都会给多个维度加权，最后再用整体向量去匹配最接近的人格，所以结果不会因为一两题失真。',
    enTitle: 'Continuous profile matching',
    enText: 'Each answer adjusts multiple dimensions, then the final type is matched from the full vector.',
  },
  {
    icon: '🎟️',
    zhTitle: '结果要能看、能讲、能截图',
    zhText: '小怪物名和结果页按传播场景设计，既能一句话讲清楚，也能直接保存海报发给别人看。',
    enTitle: 'Built for sharing',
    enText: 'Type names and result pages are designed to be readable, memorable, and screenshot-friendly.',
  },
];

const processTiles = [
  {
    icon: '📝',
    zhTitle: '开始答题',
    zhText: '当前版本是一组现实场景题，手机端可以顺着快速做完。',
    enTitle: 'Start the test',
    enText: 'The current scenario set is designed for quick mobile completion.',
  },
  {
    icon: '🧭',
    zhTitle: '生成维度落点',
    zhText: '系统会先生成你的六维关系向量，而不是先贴标签。',
    enTitle: 'Map the dimensions',
    enText: 'The engine builds a six-axis profile before assigning any label.',
  },
  {
    icon: '🎭',
    zhTitle: '匹配人格结果',
    zhText: '再从 16 个核心角色里找出最接近的一型，并切换三种展示面。',
    enTitle: 'Match the type',
    enText: 'Your profile is matched to one of the 16 core roles, then rendered across three faces.',
  },
  {
    icon: '📤',
    zhTitle: '保存结果海报',
    zhText: '结果页支持一键导出海报和复制链接，方便转发。',
    enTitle: 'Export and share',
    enText: 'Save the poster or copy the result link directly from the final page.',
  },
];

export function AboutPage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  if (!pack) return null;
  const sourceMap = new Map((pack.meta.methodology.sources ?? []).map((source) => [source.id, source]));
  const sources = pack.meta.methodology.sources ?? [];
  const questionPrinciples = pack.meta.methodology.questionPrinciples ?? [];

  return (
    <div className="ref-shell">
      <SiteChrome current="about" />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{pickLocale({ zh: '🎀 关于 LBTI 测试', en: '🎀 About LBTI' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '🫶 轻松、客观、有梗的恋爱人格探索工具',
                en: 'A playful, readable, and grounded love personality tool',
              },
              locale,
            )}
          </p>
        </section>

        <section className="ref-about-intro">
          <p>
            {pickLocale(
              {
                zh: '💌 LBTI 是一个轻松但不敷衍的恋爱人格测试。它不靠一堆术语定义你，而是把情侣关系里最稳定的 6 类互动机制，翻译成普通人看得懂的现实场景题。',
                en: 'LBTI is a playful but grounded love personality test built from real relationship situations rather than abstract jargon.',
              },
              locale,
            )}
          </p>
        </section>

        <section className="ref-about-tiles">
          {aboutTiles.map((item) => (
            <article className="ref-about-tile" key={item.zhTitle}>
              <span>{item.icon}</span>
              <h2>{pickLocale({ zh: item.zhTitle, en: item.enTitle }, locale)}</h2>
              <p>{pickLocale({ zh: item.zhText, en: item.enText }, locale)}</p>
            </article>
          ))}
        </section>

        <section className="ref-about-notes">
          {aboutNotes.map((item) => (
            <article className="ref-about-note" key={item.zhTitle}>
              <span>{item.icon}</span>
              <div>
                <h2>{pickLocale({ zh: item.zhTitle, en: item.enTitle }, locale)}</h2>
                <p>{pickLocale({ zh: item.zhText, en: item.enText }, locale)}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <div>
              <h2>{pickLocale({ zh: '🧪 6 个维度为什么够覆盖情侣互动', en: '🧪 Why These Six Dimensions Work' }, locale)}</h2>
              <p className="ref-section__lede">
                {pickLocale(
                  {
                    zh: 'LBTI 把情侣互动里最常反复出问题的地方，收成 6 个连续机制：回应、表达、修复、边界、承诺、撤离。',
                    en: 'LBTI compresses recurring relationship mechanisms into six continuous dimensions.',
                  },
                  locale,
                )}
              </p>
            </div>
          </div>
          <div className="ref-model-grid">
            {pack.meta.dimensionDetails.map((detail) => (
              <article className="ref-model-card" key={detail.key}>
                {detail.scienceTag ? <small className="ref-model-card__tag">{detail.scienceTag}</small> : null}
                <h3>{detail.title}</h3>
                <p>
                  {detail.leftLabel} <span>/</span> {detail.rightLabel}
                </p>
                {detail.coverage ? <span className="ref-model-card__note">📌 {detail.coverage}</span> : null}
                {detail.sourceIds?.length ? (
                  <div className="ref-card-links">
                    {detail.sourceIds
                      .map((sourceId) => sourceMap.get(sourceId))
                      .filter((source): source is NonNullable<typeof source> => Boolean(source))
                      .map((source) => (
                        <a
                          className="ref-card-link"
                          href={source.url}
                          key={source.id}
                          rel="noreferrer"
                          target="_blank"
                        >
                          🔗 {source.publisher}
                        </a>
                      ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {sources.length ? (
        <section className="ref-section ref-section--tight">
          <div className="ref-section__head">
            <div>
              <h2>{pickLocale({ zh: '🔬 学术依据与参考文献', en: '🔬 Research Basis & References' }, locale)}</h2>
              <p className="ref-section__lede">
                {pickLocale(
                  {
                    zh: '我们把关系科学里最常见、最稳定的框架，翻译成适合手机端答题和分享的内容结构。下面是明确引用到的学术来源。',
                    en: 'These dimensions are adapted from recurring themes in relationship science.',
                  },
                  locale,
                )}
              </p>
            </div>
          </div>
          <div className="ref-source-list">
            {sources.map((source, index) => (
              <article className="ref-source-card" key={source.id}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <div>
                  <strong>{source.title}</strong>
                  {source.citation ? <span className="ref-source-card__citation">📚 {source.citation}</span> : null}
                  <p>{source.takeaway}</p>
                  <div className="ref-card-links">
                    <a className="ref-card-link" href={source.url} rel="noreferrer" target="_blank">
                      🔗 {source.publisher}
                    </a>
                    <span className="ref-source-card__topics">🧬 {source.appliesTo.join(' / ')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        ) : null}

        {questionPrinciples.length ? (
        <section className="ref-section ref-section--tight">
          <div className="ref-section__head">
            <div>
              <h2>{pickLocale({ zh: '📝 题目设计依据', en: '📝 Question Design Basis' }, locale)}</h2>
              <p className="ref-section__lede">
                {pickLocale(
                  {
                    zh: '题库按覆盖需要扩展。当前版本的每组题都对应一个具体关系机制，不是随机拼出来的场景梗题。',
                    en: 'The question set expands with coverage needs, and each block maps to a specific relationship mechanism.',
                  },
                  locale,
                )}
              </p>
            </div>
          </div>
          <div className="ref-source-list">
            {questionPrinciples.map((principle, index) => (
              <article className="ref-source-card" key={principle.key}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <div>
                  <strong>{principle.title}</strong>
                  <p>{principle.text}</p>
                  <div className="ref-card-links">
                    {principle.sourceIds
                      .map((sourceId) => sourceMap.get(sourceId))
                      .filter((source): source is NonNullable<typeof source> => Boolean(source))
                      .map((source) => (
                        <a
                          className="ref-card-link"
                          href={source.url}
                          key={source.id}
                          rel="noreferrer"
                          target="_blank"
                        >
                          🔗 {source.publisher}
                        </a>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        ) : null}

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '🪄 测试流程', en: '🪄 Test Flow' }, locale)}</h2>
          </div>
          <div className="ref-process-grid">
            {processTiles.map((item) => (
              <article className="ref-process-card" key={item.zhTitle}>
                <span>{item.icon}</span>
                <h2>{pickLocale({ zh: item.zhTitle, en: item.enTitle }, locale)}</h2>
                <p>{pickLocale({ zh: item.zhText, en: item.enText }, locale)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ref-about-cta">
          <p>
            {pickLocale(
              {
                zh: '🎀 准备好了就直接开始。答完以后，你会得到类型名、维度落点、相邻人格和分享海报。',
                en: 'When you are ready, start the test and unlock your type, dimensions, nearby profiles, and poster.',
              },
              locale,
            )}
          </p>
          <a className="ref-button ref-button--primary" href={getStartTestHref()}>
            {pickLocale({ zh: '进入测试', en: 'Start Test' }, locale)}
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
