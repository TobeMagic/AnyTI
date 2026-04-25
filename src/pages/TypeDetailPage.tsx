import { useEffect, useRef, useState } from 'react';
import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { cosineSimilarity } from '@/lib/quiz';
import { getStartTestHref, getTypeDetailHref, getTypesHref } from '@/lib/routes';
import { findLovePersonalityByRouteSlug, getAdjacentLoveFace, getLoveArchiveReading, getLoveFace, getLoveFaceImagePath, getLoveMeta, loveFaceTabs } from '@/lib/lbti-showcase';

function getRouteSlug() {
  if (typeof window === 'undefined') return '';
  const parts = window.location.pathname.split('/').filter(Boolean);
  const last = parts.at(-1) ?? '';
  return last === 'index.html' ? parts.at(-2) ?? '' : last;
}

function describeDimension(score: number, leftLabel: string, rightLabel: string) {
  if (score >= 0.66) {
    return `明显偏 ${rightLabel}，在关键关系场景里更常先表现出 ${rightLabel}。`;
  }
  if (score >= 0.24) {
    return `略偏 ${rightLabel}，平时会更容易滑向 ${rightLabel} 这一端。`;
  }
  if (score <= -0.66) {
    return `明显偏 ${leftLabel}，碰到情绪和关系压力时更常回到 ${leftLabel}。`;
  }
  if (score <= -0.24) {
    return `略偏 ${leftLabel}，大多数时候会自然站在 ${leftLabel} 这一侧。`;
  }
  return `会在 ${leftLabel} 和 ${rightLabel} 之间切换，属于典型的场景波动型。`;
}

function buildContrastSummary(personality: NonNullable<ReturnType<typeof findLovePersonalityByRouteSlug>>, allTypes: typeof personality[]) {
  const visible = allTypes.filter((item) => item.id !== personality.id);
  const ranked = visible
    .map((item) => ({
      personality: item,
      similarity: cosineSimilarity(personality.targetVector, item.targetVector),
    }))
    .sort((left, right) => right.similarity - left.similarity);

  return {
    easiestLove: ranked[0]?.personality,
    chaosType: ranked.at(-1)?.personality,
    twinType: ranked[1]?.personality,
  };
}

export function TypeDetailPage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  const [activeFace, setActiveFace] = useState<'selfMock' | 'animal' | 'sweet'>('selfMock');
  const touchStartX = useRef<number | null>(null);
  if (!pack) return null;

  const routeSlug = getRouteSlug();
  const personality = findLovePersonalityByRouteSlug(pack.personalities, routeSlug);
  const visibleTypes = getVisiblePersonalities(pack.personalities).sort((a, b) => {
    const left = getLoveMeta(a.id)?.heat ?? 999;
    const right = getLoveMeta(b.id)?.heat ?? 999;
    return left - right;
  });

  if (!personality) {
    return (
      <div className="ref-shell">
        <SiteChrome current="types" />
        <main className="ref-page ref-page--sub">
          <section className="ref-centered-hero">
            <h1>{pickLocale({ zh: '未找到该人格档案', en: 'Type Not Found' }, locale)}</h1>
            <p>{pickLocale({ zh: '这个人格页还没有准备好，先回图鉴看看其他类型。', en: 'This archive page is not ready yet.' }, locale)}</p>
            <div className="ref-actions">
              <a className="ref-button ref-button--primary" href={getTypesHref()}>
                {pickLocale({ zh: '返回人格图鉴', en: 'Back to Types' }, locale)}
              </a>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const meta = getLoveMeta(personality.id);
  const face = getLoveFace(personality.id, activeFace);
  const archiveReading = getLoveArchiveReading(personality, activeFace);
  const currentIndex = visibleTypes.findIndex((item) => item.id === personality.id);
  const neighbors = visibleTypes
    .filter((item) => item.id !== personality.id)
    .slice(Math.max(currentIndex - 2, 0), currentIndex + 3)
    .slice(0, 4);
  const contrast = buildContrastSummary(personality, visibleTypes);

  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    for (const tab of loveFaceTabs) {
      const imagePath = getLoveFaceImagePath(personality.id, tab.key);
      if (!imagePath) continue;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imagePath;
      document.head.appendChild(link);
      links.push(link);

      const image = new Image();
      image.decoding = 'async';
      image.src = imagePath;
      void image.decode?.().catch(() => undefined);
    }

    return () => {
      links.forEach((link) => link.remove());
    };
  }, [personality.id]);

  function handleFaceSwipeStart(clientX: number) {
    touchStartX.current = clientX;
  }

  function handleFaceSwipeEnd(clientX: number) {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 36) return;
    setActiveFace((previous) => getAdjacentLoveFace(previous, delta < 0 ? 'next' : 'prev'));
  }

  return (
    <div className="ref-shell">
      <SiteChrome current="types" />
      <main className="ref-page ref-page--sub ref-page--narrow">
        <section className="ref-triptych-stage ref-triptych-stage--detail">
          <div className="ref-triptych-stage__head">
            <p className="ref-type-detail-hero__eyebrow">
              {pickLocale({ zh: '恋爱小怪物档案馆 / 图鉴静态呈现', en: 'Love Creature Archive / Static Profile View' }, locale)}
            </p>
            <h2 className="ref-triptych-stage__title">{pickLocale({ zh: '同一个角色的三副面孔', en: 'Three Faces Of The Same Role' }, locale)}</h2>
            <p className="ref-triptych-stage__lede">{pickLocale({ zh: '转动卡片，看见这一型的另一面。', en: 'Turn the card and see another face of this role.' }, locale)}</p>
          </div>

          {face ? (
            <div className="ref-face-switch ref-face-switch--center ref-face-switch--dots" role="tablist" aria-label="人格展示面切换">
              {loveFaceTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`ref-face-switch__button ${activeFace === tab.key ? 'is-active' : ''}`}
                  onClick={() => setActiveFace(tab.key)}
                  aria-selected={activeFace === tab.key}
                  aria-label={tab.label}
                  role="tab"
                  title={tab.label}
                  type="button"
                >
                  <span>{tab.icon}</span>
                </button>
              ))}
            </div>
          ) : null}

          <div
            className="ref-triptych-card-shell"
            onTouchEnd={(event) => handleFaceSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}
            onTouchStart={(event) => handleFaceSwipeStart(event.touches[0]?.clientX ?? 0)}
          >
            <article className={`ref-triptych-card ref-triptych-card--${activeFace}`} key={activeFace}>
              <span className="ref-triptych-card__watermark" aria-hidden="true">{face?.code ?? meta?.code ?? 'LBTI'}</span>
              <span className="ref-triptych-card__ribbon">{face?.faceLabel ?? '当前展示'}</span>
              <span className="ref-triptych-card__stamp">ARCHIVE</span>
              <figure className="ref-triptych-card__portrait">
                <PlaceholderPortrait
                  accent="#d36d4b"
                  imageFetchPriority="high"
                  imageLoading="eager"
                  imagePath={getLoveFaceImagePath(personality.id, activeFace)}
                  label={face?.name ?? meta?.name ?? personality.name}
                  size="240px"
                  soft="#f7dfd4"
                />
                <figcaption className="ref-triptych-card__image-caption">角色插画</figcaption>
              </figure>
              <small className="ref-triptych-card__face">{face?.icon ?? meta?.emoji} {face?.faceLabel ?? '当前展示'}</small>
              <h1 className="ref-triptych-card__code">{face?.code ?? meta?.code ?? 'LBTI'}</h1>
              <h3 className="ref-triptych-card__name">{face?.name ?? meta?.name ?? personality.name}</h3>
              <blockquote className="ref-triptych-card__quote">{face?.quote ?? meta?.quote ?? personality.vibe}</blockquote>
              <div className="ref-triptych-card__footer">
                <small>同一角色 · 三种展示</small>
                <small>{face?.icon ?? meta?.emoji} 第 {loveFaceTabs.findIndex((tab) => tab.key === activeFace) + 1} 面 / 3</small>
              </div>
              <p className="ref-triptych-card__swipe">左右滑动，切换另一面</p>
            </article>
          </div>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: `${face?.faceLabel ?? '当前展示'} · 官方速读`, en: `${face?.faceLabel ?? 'Current Face'} · Archive Reading` }, locale)}</h2>
          </div>
          <div className="ref-type-detail-prose">
            {(archiveReading?.overview ?? [personality.summary, personality.whyItHits]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '真实场景', en: 'Scene Reading' }, locale)}</h2>
          </div>
          <div className="ref-type-detail-prose">
            {(archiveReading?.scenario ?? [personality.vibe, personality.repairTip ?? personality.whyItHits]).filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '🧬 这只的六维切面', en: '🧬 Six Creature Dimensions' }, locale)}</h2>
          </div>
          <div className="ref-type-detail-dimensions">
            {pack.meta.dimensionDetails.map((detail) => {
              const score = personality.targetVector[detail.key] ?? 0;
              return (
                <article className="ref-type-detail-dimension" key={detail.key}>
                  <header>
                    <strong>{detail.title}</strong>
                    <span>{score >= 0 ? detail.rightLabel : detail.leftLabel}</span>
                  </header>
                  <p>{describeDimension(score, detail.leftLabel, detail.rightLabel)}</p>
                </article>
              );
            })}
          </div>
          <p className="ref-type-detail-note">
            {pickLocale(
              { zh: '这是公开图鉴页，不是你的个人测试结论。', en: 'This page is a public archive profile, not your personal test result.' },
              locale,
            )}
          </p>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '💥 对照关系图', en: '💥 Contrast Map' }, locale)}</h2>
          </div>
          <div className="ref-type-detail-facts">
            {contrast.easiestLove ? (
              <article className="ref-type-detail-fact">
                <small>💘 最容易爱上谁</small>
                <p>{getLoveMeta(contrast.easiestLove.id)?.emoji} {getLoveMeta(contrast.easiestLove.id)?.name ?? contrast.easiestLove.name}。你们更容易在节奏和关系语言上对上拍。</p>
              </article>
            ) : null}
            {contrast.chaosType ? (
              <article className="ref-type-detail-fact">
                <small>🌪️ 最容易被谁搞疯</small>
                <p>{getLoveMeta(contrast.chaosType.id)?.emoji} {getLoveMeta(contrast.chaosType.id)?.name ?? contrast.chaosType.name}。这类组合更容易在回应、边界或推进感上互相踩雷。</p>
              </article>
            ) : null}
            {contrast.twinType ? (
              <article className="ref-type-detail-fact">
                <small>🪞 最像你的另一只</small>
                <p>{getLoveMeta(contrast.twinType.id)?.emoji} {getLoveMeta(contrast.twinType.id)?.name ?? contrast.twinType.name}。会互相理解，也可能在同一种地方一起卡壳。</p>
              </article>
            ) : null}
          </div>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '🪄 继续浏览', en: '🪄 Continue Browsing' }, locale)}</h2>
          </div>
          <div className="ref-type-continue-grid">
            {neighbors.map((item) => {
              const itemMeta = getLoveMeta(item.id);
              return (
                <a className="ref-type-continue-card" href={getTypeDetailHref(itemMeta?.routeSlug ?? item.slug)} key={item.id}>
                  <small>{itemMeta?.emoji} {itemMeta?.code}</small>
                  <strong>{itemMeta?.emoji} {itemMeta?.name ?? item.name}</strong>
                  <p>{itemMeta?.quote ?? item.vibe}</p>
                </a>
              );
            })}
          </div>
          <div className="ref-actions">
            <a className="ref-button ref-button--primary" href={getStartTestHref()}>
              {pickLocale({ zh: '重新测试', en: 'Retake Test' }, locale)}
            </a>
            <a className="ref-button ref-button--ghost" href={getTypesHref()}>
              {pickLocale({ zh: '继续浏览', en: 'Browse Types' }, locale)}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
