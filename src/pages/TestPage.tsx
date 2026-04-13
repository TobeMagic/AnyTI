import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { QuizRunner } from '@/components/QuizRunner';
import { ResultPanel } from '@/components/ResultPanel';
import { SiteChrome } from '@/components/SiteChrome';
import { getCategoryBySlug, getPackBySlug, getTestBySlug, registryTests, testPacks } from '@/lib/content';
import { createEmptySession, resolveResult, summarizeDimensions } from '@/lib/quiz';
import { getCategoryHref, getCurrentHref, getTestHref } from '@/lib/routes';
import type { QuizSession } from '@/lib/types';

type TestPageProps = {
  slug: string;
};

function sessionKey(slug: string) {
  return `anyti:${slug}:session`;
}

export function TestPage({ slug }: TestPageProps) {
  const pack = getPackBySlug(slug);
  const test = getTestBySlug(slug);
  const category = test ? getCategoryBySlug(test.category) : undefined;
  const [session, setSession] = useState<QuizSession>(createEmptySession);
  const [restored, setRestored] = useState(false);

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

  const progressCopy = restored && !isComplete
    ? `已帮你接回上次做到的第 ${session.currentIndex + 1} 题。`
    : pack.meta.summary;

  const currentQuestion = pack.questions[session.currentIndex];
  const toneCards = pack.personalities.slice(0, 4);

  function handleStart() {
    setSession((previous) => ({
      ...previous,
      started: true,
    }));
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
        <section className="hero hero--test">
          <div>
            <p className="eyebrow">{category.title}</p>
            <h1>{pack.meta.title}</h1>
            <p className="hero__lede">{progressCopy}</p>
            <div className="chip-row">
              <span className="metric-chip">{pack.meta.durationLabel}</span>
              <span className="metric-chip">{pack.meta.questionCount} 道题</span>
              <span className="metric-chip">{pack.meta.accentLabel}</span>
            </div>
          </div>
          <div className="hero-card-stack" data-testid="featured-types">
            {toneCards.map((personality) => (
              <article className="mini-type-card" key={personality.id}>
                <span>{personality.name}</span>
                <small>{personality.badge}</small>
              </article>
            ))}
          </div>
        </section>

        {!session.started && !isComplete ? (
          <section className="section-block section-block--narrow">
            <div className="cta-panel">
              <h2>这不是学术人格判定，是一张更像当代活人状态的标签卡。</h2>
              <p>
                结果会按多维连续谱去匹配，不会把你硬塞成一刀两断的二元人。角色图先用占位符，先把节奏和传播链路跑通。
              </p>
              <div className="result-actions">
                <button className="primary-button" onClick={handleStart} type="button">
                  开始这个测试
                </button>
                <a className="ghost-button" href={getCategoryHref(category.slug)}>
                  先看类别主页
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {!isComplete ? (
          <section className="section-block">
            <div className="section-heading">
              <h2>它为什么会这么判</h2>
              <p>娱乐感要强，但方法边界也得说清楚，用户才更愿意信这个标签。</p>
            </div>
            <div className="method-grid" data-testid="method-grid">
              <article className="result-card">
                <h3>参考方向</h3>
                <ul className="bullet-list">
                  {pack.meta.methodology.inspiration.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="result-card">
                <h3>计分方式</h3>
                <p>{pack.meta.methodology.scoring}</p>
              </article>
              <article className="result-card">
                <h3>解释边界</h3>
                <p>{pack.meta.methodology.disclaimer}</p>
              </article>
            </div>
          </section>
        ) : null}

        {session.started && !isComplete && currentQuestion ? (
          <QuizRunner
            currentIndex={session.currentIndex}
            pickedId={session.answers[session.currentIndex]}
            question={currentQuestion}
            total={pack.questions.length}
            onPick={handlePick}
          />
        ) : null}

        {resolved?.result ? (
          <ResultPanel
            category={category}
            dimensions={dimensions}
            onRestart={handleRestart}
            pack={pack}
            permalink={permalink}
            result={resolved.result}
          />
        ) : null}

        {resolved?.result ? (
          <section className="section-block">
            <div className="section-heading">
              <h2>测完这个，下一站去哪</h2>
              <p>结果页必须把单次测试流量接住，而不是把你丢回浏览器标签栏。</p>
            </div>
            <div className="test-grid" data-testid="recommendation-strip">
              {recommendations.map((entry) => (
                <article className={`test-card ${entry.status === 'upcoming' ? 'is-upcoming' : ''}`} key={entry.id}>
                  <p className="eyebrow">{entry.status === 'live' ? 'Next test' : 'Queue up next'}</p>
                  <h3>{entry.title}</h3>
                  <p>{entry.teaser}</p>
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
