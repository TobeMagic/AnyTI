import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { QuizRunner } from '@/components/QuizRunner';
import { ResultPanel } from '@/components/ResultPanel';
import { SiteChrome } from '@/components/SiteChrome';
import { groupPersonalities, getVisiblePersonalities } from '@/lib/archetypes';
import { getCategoryBySlug, getPackBySlug, getTestBySlug, registryTests } from '@/lib/content';
import { createEmptySession, resolveResult, summarizeDimensions } from '@/lib/quiz';
import { getCategoryHref, getCurrentHref, getTestHref } from '@/lib/routes';
import type { QuizSession } from '@/lib/types';

type TestPageProps = {
  slug: string;
};

function sessionKey(slug: string) {
  return `anyti:${slug}:session`;
}

function scrollToAnchor(node: HTMLDivElement | null) {
  if (!node || typeof window === 'undefined') return;

  const chrome = document.querySelector('.site-chrome');
  const chromeHeight = chrome instanceof HTMLElement ? chrome.getBoundingClientRect().height : 0;
  const extraOffset = window.innerWidth <= 760 ? 56 : 24;
  const top = node.getBoundingClientRect().top + window.scrollY - chromeHeight - extraOffset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: 'auto',
  });
}

export function TestPage({ slug }: TestPageProps) {
  const pack = getPackBySlug(slug);
  const test = getTestBySlug(slug);
  const category = test ? getCategoryBySlug(test.category) : undefined;
  const [session, setSession] = useState<QuizSession>(createEmptySession);
  const [restored, setRestored] = useState(false);
  const quizAnchorRef = useRef<HTMLDivElement | null>(null);
  const resultAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(sessionKey(slug));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as QuizSession;
      setSession(parsed);
      setRestored(parsed.started);
    } catch {
      localStorage.removeItem(sessionKey(slug));
    }
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(sessionKey(slug), JSON.stringify(session));
  }, [slug, session]);

  if (!pack || !test || !category) {
    return (
      <div className="page-shell">
        <SiteChrome />
        <main className="page-shell__main">
          <section className="section-block">
            <h1>这个测试还没上线</h1>
            <p>先回首页，或者去看另一个已经能测的类别。</p>
          </section>
        </main>
      </div>
    );
  }

  const isComplete = session.answers.length >= pack.questions.length;
  const resolved = isComplete ? resolveResult(pack, session.answers) : undefined;
  const dimensions = resolved ? summarizeDimensions(pack, resolved.vector) : [];
  const permalink = getCurrentHref();
  const recommendationIds =
    resolved?.result.recommendationIds?.length
      ? resolved.result.recommendationIds
      : pack.meta.recommendationIds;

  const recommendations = recommendationIds
    .map((id) => registryTests.find((entry) => entry.id === id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const currentQuestion = pack.questions[session.currentIndex];
  const progressCopy = restored && !isComplete
    ? `上次答到第 ${session.currentIndex + 1} 题，我已经帮你接回来了。`
    : pack.meta.summary;
  const visibleTypes = getVisiblePersonalities(pack.personalities);
  const groupedTypes = groupPersonalities(pack.personalities);
  const featuredTypes = visibleTypes.slice(0, 4);
  const nearbyTypes =
    resolved?.ranked.filter((entry) => entry.personality.id !== resolved.result.id) ?? [];
  const startLabel = restored && !isComplete ? `继续第 ${session.currentIndex + 1} 题` : '开始这个测试';

  function handleStart() {
    setSession((previous) => ({
      ...previous,
      started: true,
    }));

    window.setTimeout(() => {
      scrollToAnchor(quizAnchorRef.current);
    }, 120);
  }

  function handlePick(optionId: string) {
    const nextAnswers = [...session.answers];
    nextAnswers[session.currentIndex] = optionId;
    const nextIndex = Math.min(session.currentIndex + 1, pack.questions.length);
    const nextResult = nextIndex >= pack.questions.length ? resolveResult(pack, nextAnswers) : undefined;

    setSession({
      started: true,
      currentIndex: nextIndex,
      answers: nextAnswers,
      resultId: nextResult?.result.id,
    });

    if (nextResult) {
      window.setTimeout(() => {
        scrollToAnchor(resultAnchorRef.current);
      }, 120);
    }
  }

  function handleRestart() {
    setRestored(false);
    setSession({
      started: true,
      currentIndex: 0,
      answers: [],
    });
  }

  return (
    <div
      className="page-shell"
      style={
        {
          '--accent': category.theme.accent,
          '--accent-soft': category.theme.accentSoft,
          '--surface': category.theme.surface,
          '--ink': category.theme.ink,
        } as CSSProperties
      }
    >
      <SiteChrome currentCategorySlug={category.slug} />
      <main className="page-shell__main">
        <section className="hero hero--test-page">
          <div className="hero__copy">
            <p className="eyebrow">{category.title}</p>
            <h1>{pack.meta.title}</h1>
            <p className="hero__lede">{progressCopy}</p>
            <div className="hero__actions">
              {!isComplete ? (
                <button className="primary-button" onClick={handleStart} type="button">
                  {startLabel}
                </button>
              ) : null}
              <a className="ghost-button ghost-button--link" href={getCategoryHref(category.slug)}>
                回到恋爱频道
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
                <strong>{pack.meta.dimensionDetails.length}</strong>
                <span>Models</span>
              </div>
              <div className="stat-strip__item">
                <strong>{visibleTypes.length}</strong>
                <span>Public Types</span>
              </div>
              <div className="stat-strip__item">
                <strong>01</strong>
                <span>Hidden Type</span>
              </div>
            </div>

            <div className="hero-list">
              <p className="hero-list__label">当前最容易被截图的角色</p>
              {featuredTypes.map((personality) => (
                <div className="hero-list__item" key={personality.id}>
                  <strong>{personality.name}</strong>
                  <span>{personality.vibe}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>这次不是随便起网名</h2>
            <p>
              `LBTI` 把恋爱里的高频真实动作拆成 6 个连续模型。前台是能传播的人话标签，后台是能支撑复用的结构底盘。
            </p>
          </div>
          <div className="model-table" data-testid="method-grid">
            {pack.meta.dimensionDetails.map((detail) => (
              <article className="model-row" key={detail.key}>
                <div className="model-row__title">
                  <strong>{detail.title}</strong>
                  <span>{detail.key.toUpperCase()}</span>
                </div>
                <div className="model-row__axis">
                  <small>{detail.leftLabel}</small>
                  <span />
                  <small>{detail.rightLabel}</small>
                </div>
              </article>
            ))}
          </div>
          <div className="story-band">
            <article className="story-band__item">
              <small>理论灵感</small>
              <p>{pack.meta.methodology.inspiration[0]}</p>
            </article>
            <article className="story-band__item">
              <small>计分方式</small>
              <p>{pack.meta.methodology.scoring}</p>
            </article>
            <article className="story-band__item">
              <small>解释边界</small>
              <p>{pack.meta.methodology.disclaimer}</p>
            </article>
          </div>
        </section>

        {!session.started && !isComplete ? (
          <section className="section-block section-block--clean">
            <div className="launch-block">
              <div className="launch-block__main">
                <p className="eyebrow">Before You Start</p>
                <h2>先看名册，再决定你想不想知道自己是哪一型。</h2>
                <p>
                  这套体验不是把你直接扔进问卷，而是先让你知道结果会长成什么样。这样用户答题时更像在抽一个想截图的身份，而不是完成一份作业。
                </p>
              </div>
              <div className="launch-block__aside">
                <button className="primary-button" onClick={handleStart} type="button">
                  {startLabel}
                </button>
                <p>结果页支持保存海报、复制链接，还会继续推荐下一张测试卡。</p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>这一版会抽出哪些角色</h2>
            <p>先逛类型名册，是 `SBTI` 一类产品最关键的入口体验。这里做成行列名册，不做卡片墙。</p>
          </div>
          <div className="roster-board" data-testid="category-type-wall">
            {groupedTypes.map(({ group, items }) => (
              <section className="roster-group" key={group}>
                <div className="roster-group__header">
                  <p className="eyebrow">{group}</p>
                </div>
                <div className="roster-group__list">
                  {items.map((personality) => (
                    <article className="roster-row" key={personality.id}>
                      <div className="roster-row__title">
                        <strong>{personality.name}</strong>
                        <span>{personality.badge}</span>
                      </div>
                      <p>{personality.vibe}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {session.started && !isComplete && currentQuestion ? (
          <div ref={quizAnchorRef}>
            <QuizRunner
              currentIndex={session.currentIndex}
              pickedId={session.answers[session.currentIndex]}
              question={currentQuestion}
              total={pack.questions.length}
              onPick={handlePick}
            />
          </div>
        ) : null}

        {resolved?.result ? (
          <div ref={resultAnchorRef}>
            <ResultPanel
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

        {resolved?.result ? (
          <section className="section-block section-block--clean">
            <div className="section-heading">
              <h2>测完这个，下一站去哪</h2>
              <p>结果不是终点。下一张测试卡要像频道跳转，而不是孤零零的“再来一题”。</p>
            </div>
            <div className="recommendation-list" data-testid="recommendation-strip">
              {recommendations.map((entry) => (
                <article className={`recommendation-row ${entry.status === 'upcoming' ? 'is-upcoming' : ''}`} key={entry.id}>
                  <div className="recommendation-row__copy">
                    <p className="eyebrow">{entry.status === 'live' ? 'Next Test' : 'Coming Soon'}</p>
                    <strong>{entry.title}</strong>
                    <span>{entry.teaser}</span>
                  </div>
                  {entry.status === 'live' ? (
                    <a className="primary-button primary-button--link" href={getTestHref(entry.slug)}>
                      进入 {entry.slug.toUpperCase()}
                    </a>
                  ) : (
                    <a className="ghost-button ghost-button--link" href={getCategoryHref(entry.category)}>
                      去看这个类别
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
