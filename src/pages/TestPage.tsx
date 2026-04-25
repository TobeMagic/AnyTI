import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { QuizRunner } from '@/components/QuizRunner';
import { ResultPanel } from '@/components/ResultPanel';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getCategoryBySlug, getPackBySlug, getTestBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getLoveMeta } from '@/lib/lbti-showcase';
import { createEmptySession, resolveResult, summarizeDimensions } from '@/lib/quiz';
import { getCurrentHref, getHomeHref, getStartTestHref } from '@/lib/routes';
import type { Personality, QuizSession } from '@/lib/types';

type TestPageProps = {
  slug: string;
  mode?: 'landing' | 'quiz';
};

function sessionKey(slug: string) {
  return `anyti:${slug}:session`;
}

function scrollToAnchor(node: HTMLDivElement | null) {
  if (!node || typeof window === 'undefined') return;

  const chrome = document.querySelector('.ref-chrome');
  const chromeHeight = chrome instanceof HTMLElement ? chrome.getBoundingClientRect().height : 0;
  const extraOffset = window.innerWidth <= 760 ? 56 : 24;
  const top = node.getBoundingClientRect().top + window.scrollY - chromeHeight - extraOffset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: 'auto',
  });
}

function sortDisplayTypes(slug: string, personalities: Personality[]) {
  if (slug !== 'lbti') {
    return personalities;
  }

  return [...personalities].sort((left, right) => {
    const leftHeat = getLoveMeta(left.id)?.heat ?? 999;
    const rightHeat = getLoveMeta(right.id)?.heat ?? 999;
    return leftHeat - rightHeat;
  });
}

export function TestPage({ slug, mode = 'landing' }: TestPageProps) {
  const locale = getPreferredLocale();
  const pack = getPackBySlug(slug);
  const test = getTestBySlug(slug);
  const category = test ? getCategoryBySlug(test.category) : undefined;
  const [session, setSession] = useState<QuizSession>(createEmptySession);
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const quizAnchorRef = useRef<HTMLDivElement | null>(null);
  const resultAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(sessionKey(slug));
    if (!raw) {
      setHydrated(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as QuizSession;
      setSession(parsed);
      setRestored(parsed.started);
    } catch {
      localStorage.removeItem(sessionKey(slug));
    } finally {
      setHydrated(true);
    }
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(sessionKey(slug), JSON.stringify(session));
  }, [slug, session]);

  if (!pack || !test || !category) {
    return (
      <div className="page-shell">
        <SiteChrome current="test" />
        <main className="page-shell__main">
          <section className="section-block">
            <h1>这个测试还没上线</h1>
            <p>这个版本当前只保留 LBTI 主站，先回恋爱测试页继续看。</p>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const isComplete = session.currentIndex >= pack.questions.length || Boolean(session.resultId);
  const sourceMap = new Map((pack.meta.methodology.sources ?? []).map((source) => [source.id, source]));
  const questionPrinciples = pack.meta.methodology.questionPrinciples ?? [];
  const resolved = isComplete ? resolveResult(pack, session.answers) : undefined;
  const dimensions = resolved ? summarizeDimensions(pack, resolved.vector) : [];
  const permalink = getCurrentHref();
  const currentQuestion = pack.questions[session.currentIndex];
  const sources = pack.meta.methodology.sources ?? [];
  const progressCopy = restored && !isComplete
    ? `上次答到第 ${session.currentIndex + 1} 题，我已经帮你接回来了。`
    : pack.meta.summary;
  const visibleTypes = sortDisplayTypes(slug, getVisiblePersonalities(pack.personalities));
  const featuredTypes = visibleTypes.slice(0, 4);
  const nearbyTypes =
    resolved?.ranked.filter((entry) => entry.personality.id !== resolved.result.id) ?? [];
  const startLabel = restored && !isComplete ? `继续第 ${session.currentIndex + 1} 题` : '开始这个测试';
  const showQuizIntro = mode === 'quiz' && !session.started && !isComplete;

  function handlePick(optionId: string) {
    const nextAnswers = [...session.answers];
    nextAnswers[session.currentIndex] = optionId;

    setSession({
      started: true,
      currentIndex: session.currentIndex,
      answers: nextAnswers,
      resultId: session.resultId,
    });
  }

  function handleStart() {
    setSession((previous) => ({
      ...previous,
      started: true,
      resultId: undefined,
    }));
    window.setTimeout(() => {
      scrollToAnchor(quizAnchorRef.current);
    }, 60);
  }

  function handleRestart() {
    setRestored(false);
    setSession({
      started: true,
      currentIndex: 0,
      answers: [],
    });
  }

  function handlePrev() {
    if (session.currentIndex <= 0) return;
    setSession((previous) => ({
      ...previous,
      currentIndex: previous.currentIndex - 1,
      resultId: undefined,
    }));
  }

  function handleAdvance() {
    const pickedId = session.answers[session.currentIndex];
    if (!pickedId) return;

    const nextIndex = session.currentIndex + 1;

    if (nextIndex >= pack.questions.length) {
      const nextResult = resolveResult(pack, session.answers);
      setSession((previous) => ({
        ...previous,
        started: true,
        currentIndex: pack.questions.length,
        resultId: nextResult.result.id,
      }));
      window.setTimeout(() => {
        scrollToAnchor(resultAnchorRef.current);
      }, 120);
      return;
    }

    setSession((previous) => ({
      ...previous,
      started: true,
      currentIndex: nextIndex,
      resultId: undefined,
    }));
    window.setTimeout(() => {
      scrollToAnchor(quizAnchorRef.current);
    }, 40);
  }

  const showLandingSections = mode === 'landing';

  return (
    <div
      className={`page-shell ${slug === 'lbti' ? 'page-shell--ref' : ''} ${mode === 'quiz' ? 'page-shell--quiz-experience' : ''} ${mode === 'quiz' && isComplete ? 'page-shell--result-archive' : ''}`}
      style={
        slug === 'lbti'
          ? undefined
          : ({
              '--accent': category.theme.accent,
              '--accent-soft': category.theme.accentSoft,
              '--surface': category.theme.surface,
              '--ink': category.theme.ink,
            } as CSSProperties)
      }
    >
      <SiteChrome current="test" />
      <main className="page-shell__main">
        {showLandingSections ? (
        <section className="hero hero--test-page">
          <div className="hero__copy">
            <p className="eyebrow">💘 {category.title}</p>
            <h1>{pack.meta.title}</h1>
            <p className="hero__lede">{progressCopy}</p>
            <div className="intro-pills">
              <span className="metric-chip">📝 {pack.meta.questionCount} Questions</span>
              <span className="metric-chip">🧬 {pack.meta.dimensionDetails.length} Models</span>
              <span className="metric-chip">🎭 {visibleTypes.length} Public Types</span>
            </div>
            <div className="hero__actions">
              {!isComplete ? (
                <a className="primary-button primary-button--link" href={getStartTestHref()}>
                  {pickLocale({ zh: `💘 ${startLabel}`, en: '💘 Start The Test' }, locale)}
                </a>
              ) : null}
              <a className="ghost-button ghost-button--link" href={getHomeHref()}>
                {pickLocale({ zh: '↩️ 返回首页', en: '↩️ Back Home' }, locale)}
              </a>
            </div>
          </div>

          <aside className="hero-side">
            <div className="stat-strip">
              <div className="stat-strip__item">
                <strong>{pack.meta.questionCount}</strong>
                <span>Questions</span>
              </div>
              <div className="stat-strip__item">
                <strong>{pack.meta.durationLabel}</strong>
                <span>Duration</span>
              </div>
              <div className="stat-strip__item">
                <strong>{visibleTypes.length}</strong>
                <span>Types</span>
              </div>
              <div className="stat-strip__item">
                <strong>03</strong>
                <span>Faces</span>
              </div>
            </div>

            <div className="hero-list">
              <p className="hero-list__label">🔥 当前最容易被截图的类型</p>
              {featuredTypes.map((personality) => {
                const meta = getLoveMeta(personality.id);
                return (
                  <div className="hero-list__item" key={personality.id}>
                    <strong>{meta?.emoji} {meta?.name ?? personality.name}</strong>
                    <span>🏷️ {meta?.alias ?? personality.badge}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>
        ) : null}

        {showLandingSections ? (
        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>{pickLocale({ zh: '🧪 测试结构', en: '🧪 Test Models' }, locale)}</h2>
            <p>
              {pickLocale(
                {
                  zh: '所有题目都写成真实互动场景，不靠空泛人设词吓人。它覆盖回应、安全感、修复、边界、承诺和撤离这 6 个高频关系机制，答完之后再按连续谱匹配结果。',
                  en: 'Every question is grounded in realistic situations. The result is matched by a continuous profile vector, not by one blunt option.',
                },
                locale,
              )}
            </p>
          </div>
          <div className="dimension-grid" data-testid="method-grid">
            {pack.meta.dimensionDetails.map((detail) => (
              <article className="dimension-chip" key={detail.key}>
                {detail.scienceTag ? <small className="dimension-chip__tag">{detail.scienceTag}</small> : null}
                <strong>{detail.title}</strong>
                <p>
                  🫧 {detail.leftLabel} <span>↔</span> {detail.rightLabel}
                </p>
                {detail.coverage ? <span className="dimension-chip__note">📌 {detail.coverage}</span> : null}
                {detail.sourceIds?.length ? (
                  <div className="dimension-chip__links">
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
        ) : null}

        {showLandingSections && sources.length ? (
        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>{pickLocale({ zh: '🔬 学术依据与参考文献', en: '🔬 Research Basis & References' }, locale)}</h2>
            <p>
              {pickLocale(
                {
                  zh: '这套题不是空口整活。下面这些研究和参考文献，是 LBTI 六维结构与题目场景的底层来源。',
                  en: 'These research anchors sit under the LBTI structure and its scenario prompts.',
                },
                locale,
              )}
            </p>
          </div>
          <div className="ref-source-list">
            {sources.slice(0, 4).map((source, index) => (
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

        {showLandingSections && questionPrinciples.length ? (
        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>{pickLocale({ zh: '📚 题目设计依据', en: '📚 Question Design Basis' }, locale)}</h2>
            <p>
              {pickLocale(
                {
                  zh: '每一组题都对应一个具体关系机制，题目不是随机整活，而是把关系科学翻译成了普通人会遇到的聊天、约会、争执和收尾场景。',
                  en: 'Each question block maps to a concrete relationship mechanism drawn from relationship science.',
                },
                locale,
              )}
            </p>
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

        {showLandingSections && !isComplete ? (
          <section className="section-block section-block--clean">
            <div className="launch-block">
              <div className="launch-block__main">
                <p className="eyebrow">🎀 Start Test</p>
                <h2>{restored ? '你上次的答题进度还在，直接回到现场继续。' : `完成当前版本 ${pack.meta.questionCount} 题，马上解锁你的恋爱标签。`}</h2>
                <p>{restored ? `💌 你已经答到第 ${session.currentIndex + 1} 题，点一下就回到答题现场。` : '💌 当前题量会继续按覆盖需要扩展；结果页会给你类型命中、维度落点、相邻人格和分享海报。'}</p>
              </div>
              <div className="launch-block__aside">
                <a className="primary-button primary-button--link" href={getStartTestHref()}>
                  💘 {startLabel}
                </a>
                <p>📱 手机端适合直接保存海报，桌面端适合下载和转发链接。</p>
              </div>
            </div>
          </section>
        ) : null}

        {showLandingSections ? (
        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>{pickLocale({ zh: '🫧 人格类型', en: '🫧 Types' }, locale)}</h2>
            <p>
              {pickLocale(
                {
                  zh: '💭 测之前先看类型库。你可以先猜自己会落在哪一型，再去验证。',
                  en: 'Scan the archive before you answer. Guess your label first, then test it.',
                },
                locale,
              )}
            </p>
          </div>
          <div className="archive-list" data-testid="category-type-wall">
            {visibleTypes.map((personality, index) => {
              const meta = getLoveMeta(personality.id);
              return (
                <article
                  className="archive-row"
                  key={personality.id}
                  style={{ animationDelay: `${80 + index * 40}ms` } as CSSProperties}
                >
                  <div className="archive-row__code">
                    <span>{meta?.emoji} {meta?.code ?? 'TYPE'}</span>
                    <small>🎭 {personality.group}</small>
                  </div>
                  <div className="archive-row__copy">
                    <p className="archive-row__eyebrow">💬 {meta?.alias ?? personality.badge}</p>
                    <div className="archive-row__name">
                      <strong>{meta?.emoji} {meta?.name ?? personality.name}</strong>
                      <span>🪞 自嘲面 / 动物面 / 甜心面</span>
                    </div>
                    <p className="archive-row__note">🫶 {meta?.quote ?? personality.vibe}</p>
                  </div>
                  <div className="archive-row__meta">
                    <span>🔥 {meta?.heatTag ?? 'Live Type'}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        ) : null}

        {showQuizIntro ? (
          <section className="test-intro">
            <div className="test-intro__inner">
              <h1>开始测试</h1>
              <p>{restored ? `系统已定位到你上次停下的位置，第 ${session.currentIndex + 1} 题可继续作答。` : '系统已就绪，开始读取你的六维关系向量。'}</p>
              <button className="ref-button ref-button--primary" onClick={handleStart} type="button">
                {restored ? '继续测试' : '开始测试'}
              </button>
            </div>
          </section>
        ) : null}

        {mode === 'quiz' && session.started && !isComplete && currentQuestion ? (
          <div ref={quizAnchorRef}>
            <QuizRunner
              key={currentQuestion.id}
              canPrev={session.currentIndex > 0}
              canNext={Boolean(session.answers[session.currentIndex])}
              currentIndex={session.currentIndex}
              isLast={session.currentIndex === pack.questions.length - 1}
              pickedId={session.answers[session.currentIndex]}
              question={currentQuestion}
              total={pack.questions.length}
              onNext={handleAdvance}
              onPick={handlePick}
              onPrev={handlePrev}
            />
          </div>
        ) : null}

        {mode === 'quiz' && resolved?.result ? (
          <div className="result-archive-page ref-page ref-page--narrow" ref={resultAnchorRef}>
            <ResultPanel
              key={resolved.result.id}
              category={category}
              dimensions={dimensions}
              match={resolved.match}
              nearby={nearbyTypes}
              onRestart={handleRestart}
              pack={pack}
              permalink={permalink}
              result={resolved.result}
            />
          </div>
        ) : null}

      </main>
      <SiteFooter compact={mode === 'quiz' && session.started && !isComplete} />
    </div>
  );
}
