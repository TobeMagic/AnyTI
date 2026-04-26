import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { addImagePreloadLinks, scheduleImagePreload } from '@/lib/image-preload';
import { buildLbtiReport } from '@/lib/lbti-report';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getAdjacentLoveFace, getLoveFaceImagePath, loveFaceTabs } from '@/lib/lbti-showcase';
import { getLocalizedLoveArchiveReading, getLocalizedLoveFace, getLocalizedLoveFaceTabs, getLocalizedLoveMeta } from '@/lib/lbti-localization';
import { buildPosterBlob } from '@/lib/poster';
import { getHomeHref, getTypeDetailHref } from '@/lib/routes';
import type { Category, DimensionSummary, RankedResult, Personality, TestPack } from '@/lib/types';
import { PlaceholderPortrait } from './PlaceholderPortrait';

type ResultPanelProps = {
  category: Category;
  pack: TestPack;
  result: Personality;
  dimensions: DimensionSummary[];
  match: number;
  nearby: RankedResult[];
  permalink: string;
  onRestart: () => void;
};

function buildSimpleReading(result: Personality) {
  return [result.summary, result.whyItHits].filter(Boolean);
}

export function ResultPanel({
  category,
  pack,
  result,
  dimensions,
  match,
  nearby,
  permalink,
  onRestart,
}: ResultPanelProps) {
  const locale = getPreferredLocale();
  const [status, setStatus] = useState('');
  const [activeFace, setActiveFace] = useState<'selfMock' | 'animal' | 'sweet'>('selfMock');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(false);
  const [posterUrls, setPosterUrls] = useState<Partial<Record<'selfMock' | 'animal' | 'sweet', string>>>({});
  const [posterLoading, setPosterLoading] = useState<Partial<Record<'selfMock' | 'animal' | 'sweet', boolean>>>({});
  const [viewedFaces, setViewedFaces] = useState<Array<'selfMock' | 'animal' | 'sweet'>>(['selfMock']);
  const touchStartX = useRef<number | null>(null);
  const posterUrlRef = useRef<Partial<Record<'selfMock' | 'animal' | 'sweet', string>>>({});
  const loveMeta = pack.meta.slug === 'lbti' ? getLocalizedLoveFace(result.id, activeFace, locale) : undefined;
  const baseMeta = pack.meta.slug === 'lbti' ? getLocalizedLoveMeta(result.id, locale) : undefined;
  const archiveReading = pack.meta.slug === 'lbti' ? getLocalizedLoveArchiveReading(result, activeFace, locale) : undefined;
  const report = buildLbtiReport(dimensions, result, locale);
  const detailHref = baseMeta?.routeSlug ? getTypeDetailHref(baseMeta.routeSlug) : undefined;
  const simpleReading = buildSimpleReading(result);
  const hasSeenAllFaces = viewedFaces.length === loveFaceTabs.length;

  useEffect(() => {
    setViewedFaces((previous) => (previous.includes(activeFace) ? previous : [...previous, activeFace]));
  }, [activeFace]);

  useEffect(() => {
    return () => {
      for (const url of Object.values(posterUrlRef.current)) {
        if (url) URL.revokeObjectURL(url);
      }
    };
  }, []);

  useEffect(() => {
    if (pack.meta.slug !== 'lbti' || typeof document === 'undefined') return undefined;

    const imageUrls = loveFaceTabs.map((tab) => getLoveFaceImagePath(result.id, tab.key));
    const removeLinks = addImagePreloadLinks(imageUrls, { fetchPriority: 'high' });
    const cancelWarmup = scheduleImagePreload(imageUrls, { fetchPriority: 'high' });

    return () => {
      removeLinks?.();
      cancelWarmup?.();
    };
  }, [pack.meta.slug, result.id]);

  useEffect(() => {
    if (pack.meta.slug !== 'lbti' || typeof window === 'undefined') return undefined;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const warmPosters = () => {
      loveFaceTabs.forEach((tab) => {
        void ensurePoster(tab.key);
      });
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(warmPosters, { timeout: 900 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(warmPosters, 180);
    return () => window.clearTimeout(timer);
  }, [pack.meta.slug, result.id]);

  useEffect(() => {
    if (!sharePreviewOpen || typeof document === 'undefined') return undefined;

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [sharePreviewOpen]);

  useEffect(() => {
    if (!sharePreviewOpen || typeof document === 'undefined') return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSharePreviewOpen(false);
      }
    }

    function preventScroll(event: TouchEvent) {
      event.preventDefault();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [sharePreviewOpen]);

  useEffect(() => {
    void ensurePoster(activeFace);
  }, [activeFace]);

  function getDisplay(faceKey: 'selfMock' | 'animal' | 'sweet') {
    const face = pack.meta.slug === 'lbti' ? getLocalizedLoveFace(result.id, faceKey, locale) : undefined;
    return face
      ? {
          name: face.name,
          code: face.code,
          quote: face.quote,
          badge: face.faceLabel,
          icon: face.icon,
          imagePath: getLoveFaceImagePath(result.id, faceKey),
        }
      : undefined;
  }

  async function ensurePoster(faceKey: 'selfMock' | 'animal' | 'sweet') {
    const cached = posterUrlRef.current[faceKey];
    if (cached) {
      return cached;
    }

    try {
      setPosterLoading((previous) => ({ ...previous, [faceKey]: true }));
      const blob = await buildPosterBlob({
        category,
        pack,
        result,
        dimensions,
        permalink,
        match,
        display: getDisplay(faceKey),
      });
      const url = URL.createObjectURL(blob);
      posterUrlRef.current[faceKey] = url;
      setPosterUrls((previous) => ({ ...previous, [faceKey]: url }));
      return url;
    } finally {
      setPosterLoading((previous) => ({ ...previous, [faceKey]: false }));
    }
  }

  async function handlePosterDownload() {
    try {
      setStatus(pickLocale({ zh: '正在准备图片…', en: 'Preparing image...' }, locale));
      const url = await ensurePoster(activeFace);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${pack.meta.slug}-${result.slug}-${activeFace}.png`;
      anchor.click();
      setStatus(pickLocale({ zh: '图片已准备好，可以保存转发。', en: 'Image is ready. Save and share it.' }, locale));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : pickLocale({ zh: '图片导出失败。', en: 'Image export failed.' }, locale));
    }
  }

  async function handleOpenSharePreview() {
    try {
      setStatus(pickLocale({ zh: '正在准备图片…', en: 'Preparing image...' }, locale));
      await ensurePoster(activeFace);
      setSharePreviewOpen(true);
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : pickLocale({ zh: '图片预览失败。', en: 'Image preview failed.' }, locale));
      setSharePreviewOpen(false);
    }
  }

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

  const currentPosterUrl = posterUrls[activeFace];
  const isCurrentPosterLoading = Boolean(posterLoading[activeFace]);
  const activeImagePath = getLoveFaceImagePath(result.id, activeFace);
  const localizedFaceTabs = getLocalizedLoveFaceTabs(locale);

  return (
    <section className="result-panel result-panel--report result-panel--archive" data-testid="result-panel">
      <section className="ref-triptych-stage result-triptych-stage">
        <div className="ref-triptych-stage__head">
          <p className="ref-type-detail-hero__eyebrow">{pickLocale({ zh: '你的爱情人格', en: 'Your Love Type' }, locale)}</p>
          <h2 className="ref-triptych-stage__title">{pickLocale({ zh: '原来你有三副面孔', en: 'You Have Three Faces' }, locale)}</h2>
          <p className="ref-triptych-stage__lede">{pickLocale({ zh: '转动卡片，看见你的另一面。', en: 'Turn the card to see another side.' }, locale)}</p>
        </div>

        <div
          className="ref-triptych-poster-stage"
          onTouchEnd={(event) => handleFaceSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}
          onTouchStart={(event) => handleFaceSwipeStart(event.touches[0]?.clientX ?? 0)}
        >
          <button
            aria-label={pickLocale({ zh: '切换到上一面', en: 'Switch to previous face' }, locale)}
            className="ref-triptych-stage__nav ref-triptych-stage__nav--prev"
            onClick={() => setActiveFace((previous) => getAdjacentLoveFace(previous, 'prev'))}
            type="button"
          >
            ←
          </button>
          <div className="ref-triptych-poster-frame">
            <button
              className={`ref-triptych-poster ref-triptych-poster--${activeFace}`}
              onClick={handleOpenSharePreview}
              type="button"
            >
              {currentPosterUrl ? (
                <img
                  alt={pickLocale({ zh: `${loveMeta?.name ?? result.name} 分享图片`, en: `${loveMeta?.name ?? result.name} share image` }, locale)}
                  className="ref-triptych-poster__image"
                  data-testid="result-image-card"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  src={currentPosterUrl}
                />
              ) : (
                <div className={`ref-triptych-card ref-triptych-card--${activeFace} ref-triptych-card--poster-placeholder`}>
                  <span className="ref-triptych-card__watermark" aria-hidden="true">{loveMeta?.code ?? pack.meta.slug.toUpperCase()}</span>
                  <span className="ref-triptych-card__ribbon">{loveMeta?.faceLabel ?? pickLocale({ zh: '当前展示', en: 'Current Face' }, locale)}</span>
                  <span className="ref-triptych-card__stamp">MATCH {match}%</span>
                  <figure className="ref-triptych-card__portrait">
                    <PlaceholderPortrait
                      accent={category.theme.accent}
                      soft={category.theme.accentSoft}
                      label={loveMeta?.name ?? result.name}
                      imageFetchPriority="high"
                      imageLoading="eager"
                      imagePath={activeImagePath}
                      size="240px"
                    />
                    <figcaption className="ref-triptych-card__image-caption">{pickLocale({ zh: '角色插画', en: 'Role Illustration' }, locale)}</figcaption>
                  </figure>
                  <small className="ref-triptych-card__face">{loveMeta?.icon} {loveMeta?.faceLabel ?? pickLocale({ zh: '当前展示', en: 'Current Face' }, locale)}</small>
                  <h2 className="ref-triptych-card__code result-panel__name--report" data-testid="result-name">
                    {loveMeta?.code ?? pack.meta.slug.toUpperCase()}
                  </h2>
                  <h3 className="ref-triptych-card__name">{loveMeta?.name ?? result.name}</h3>
                  <blockquote className="ref-triptych-card__quote">
                    {isCurrentPosterLoading ? pickLocale({ zh: '正在生成分享图…', en: 'Generating share image...' }, locale) : loveMeta?.quote ?? result.vibe}
                  </blockquote>
                </div>
              )}
            </button>
            <p className="ref-triptych-poster__hint">
              {loveMeta?.icon} {loveMeta?.faceLabel ?? pickLocale({ zh: '当前展示', en: 'Current Face' }, locale)} · {pickLocale({ zh: '点击图片保存转发 · 左右切换另一面', en: 'Tap image to save and share · Swipe to switch face' }, locale)}
            </p>
          </div>
          <button
            aria-label={pickLocale({ zh: '切换到下一面', en: 'Switch to next face' }, locale)}
            className="ref-triptych-stage__nav ref-triptych-stage__nav--next"
            onClick={() => setActiveFace((previous) => getAdjacentLoveFace(previous, 'next'))}
            type="button"
          >
            →
          </button>
        </div>

        <div className="ref-triptych-stage__meta">
          <strong className="result-panel__matchline" data-testid="result-name">
            {pickLocale({ zh: '你的主类型', en: 'Your main type' }, locale)} · {pickLocale({ zh: '匹配度', en: 'Match' }, locale)} {match}% · {pickLocale({ zh: '当前展示', en: 'Current face' }, locale)} {loveMeta?.faceLabel ?? pickLocale({ zh: '核心结果', en: 'Core Result' }, locale)} · {pickLocale({ zh: '精准命中', en: 'Dimension hits' }, locale)} {report.matchedCount}/{report.total}
          </strong>
          <p className="result-panel__verdict">{report.verdict}</p>
        </div>

        <div className="ref-actions result-actions result-actions--report result-actions--triptych">
          <button className="ref-button ref-button--ghost" onClick={() => setDrawerOpen(true)} type="button">
            {pickLocale({ zh: '查看完整档案', en: 'View Full Archive' }, locale)}
          </button>
          <button className="ref-button ref-button--primary" onClick={handleOpenSharePreview} type="button">
            {pickLocale({ zh: '分享图片', en: 'Share Image' }, locale)}
          </button>
          <button className="ref-button ref-button--ghost" onClick={onRestart} type="button">
            {pickLocale({ zh: '重新测试', en: 'Retake Test' }, locale)}
          </button>
          <a className="ref-button ref-button--ghost" href={getHomeHref()}>
            {pickLocale({ zh: '回到首页', en: 'Back Home' }, locale)}
          </a>
        </div>
        {hasSeenAllFaces ? (
          <p className="ref-triptych-stage__toast">
            {pickLocale({ zh: '自嘲是你的保护色，动物是你的本能，而甜心是你值得被爱的证明。', en: 'Self-mock is your armor, animal is your instinct, and sweet face is proof that you deserve love.' }, locale)}
          </p>
        ) : null}
        {status ? <p className="ref-type-detail-note result-status result-status--archive">{status}</p> : null}
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>{loveMeta?.faceLabel ?? pickLocale({ zh: '当前展示', en: 'Current Face' }, locale)} · {pickLocale({ zh: '官方速读', en: 'Official Reading' }, locale)}</h2>
        </div>
        <div className="ref-type-detail-prose">
          {(archiveReading?.overview ?? simpleReading).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>{pickLocale({ zh: '真实场景', en: 'Scene Reading' }, locale)}</h2>
        </div>
        <div className="ref-type-detail-prose">
          {(archiveReading?.scenario ?? [result.vibe, result.repairTip ?? result.whyItHits]).filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>{pickLocale({ zh: '🧬 这只的六维切面', en: '🧬 Six-Dimension Profile' }, locale)}</h2>
        </div>
        <div className="ref-type-detail-dimensions result-score-list">
          {report.items.map((item) => (
            <article className="ref-type-detail-dimension result-score-item" key={item.key}>
              <header>
                <strong>{item.code} {item.title}</strong>
                <span>{item.band} / {item.points}{pickLocale({ zh: '分', en: ' pts' }, locale)}</span>
              </header>
              <div className="result-dimension-meter" aria-hidden="true">
                <span className="result-dimension-meter__label result-dimension-meter__label--left">
                  {dimensions.find((entry) => entry.key === item.key)?.leftLabel ?? pickLocale({ zh: '左侧', en: 'Left' }, locale)}
                </span>
                <div className="result-dimension-meter__track">
                  <span className="result-dimension-meter__midline" />
                  <span className="result-dimension-meter__dot" style={{ left: `${Math.max(8, Math.min(92, ((item.score + 100) / 200) * 100))}%` }} />
                </div>
                <span className="result-dimension-meter__label result-dimension-meter__label--right">
                  {dimensions.find((entry) => entry.key === item.key)?.rightLabel ?? pickLocale({ zh: '右侧', en: 'Right' }, locale)}
                </span>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>{pickLocale({ zh: '📌 友情提示', en: '📌 Friendly Note' }, locale)}</h2>
        </div>
        <p className="ref-type-detail-note result-report-section__prose">{pack.meta.methodology.disclaimer}</p>
      </section>

      {nearby.length ? (
        <section className="ref-section result-report-section result-report-section--archive">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '🪄 继续浏览', en: '🪄 Continue Browsing' }, locale)}</h2>
          </div>
          <div className="ref-type-continue-grid">
            {nearby.slice(0, 4).map((entry) => {
              const relatedMeta = getLocalizedLoveMeta(entry.personality.id, locale);
              const href = relatedMeta?.routeSlug
                ? getTypeDetailHref(relatedMeta.routeSlug)
                : getTypeDetailHref(entry.personality.slug);

              return (
                <a className="ref-type-continue-card" href={href} key={entry.personality.id}>
                  <small>{relatedMeta?.emoji} {relatedMeta?.code ?? 'LBTI'}</small>
                  <strong>{relatedMeta?.emoji} {relatedMeta?.name ?? entry.personality.name}</strong>
                  <p>{relatedMeta?.quote ?? entry.personality.vibe}</p>
                </a>
              );
            })}
          </div>
        </section>
      ) : null}

      {drawerOpen && typeof document !== 'undefined'
        ? createPortal(
            <div className="ref-archive-drawer-backdrop" onClick={() => setDrawerOpen(false)} role="presentation">
              <aside
                aria-labelledby="lbti-archive-drawer-title"
                aria-modal="true"
                className="ref-archive-drawer"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="ref-archive-drawer__head">
                  <div>
                    <p className="ref-type-detail-hero__eyebrow">{pickLocale({ zh: '完整档案', en: 'Full Archive' }, locale)}</p>
                    <h3 className="ref-archive-drawer__title" id="lbti-archive-drawer-title">
                      {loveMeta?.code ?? result.badge.split('/')[0]?.trim() ?? 'LBTI'} · {loveMeta?.name ?? result.name}
                    </h3>
                  </div>
                  <button
                    aria-label={pickLocale({ zh: '关闭完整档案', en: 'Close full archive' }, locale)}
                    className="ref-archive-drawer__close"
                    onClick={() => setDrawerOpen(false)}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div className={`ref-archive-drawer__hero ref-archive-drawer__hero--${activeFace}`}>
                  <div className="ref-archive-drawer__portrait">
                    <PlaceholderPortrait
                      accent={category.theme.accent}
                      soft={category.theme.accentSoft}
                      label={loveMeta?.name ?? result.name}
                      imageFetchPriority="high"
                      imageLoading="eager"
                      imagePath={activeImagePath}
                      size="132px"
                    />
                  </div>
                  <div className="ref-archive-drawer__intro">
                    <div
                      className="ref-face-switch ref-face-switch--drawer"
                      role="tablist"
                      aria-label={pickLocale({ zh: '档案面孔切换', en: 'Archive face switcher' }, locale)}
                    >
                      {localizedFaceTabs.map((tab) => (
                        <button
                          key={tab.key}
                          aria-selected={activeFace === tab.key}
                          className={`ref-face-switch__button ${activeFace === tab.key ? 'is-active' : ''}`}
                          onClick={() => setActiveFace(tab.key)}
                          role="tab"
                          type="button"
                        >
                          <span>{tab.icon}</span>
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <p className="ref-archive-drawer__quote">{loveMeta?.quote ?? result.vibe}</p>
                  </div>
                </div>

                <div className="ref-archive-drawer__grid">
                  <article className="ref-archive-drawer__fact">
                    <small>{pickLocale({ zh: '当前面孔', en: 'Current Face' }, locale)}</small>
                    <p>{loveMeta?.faceLabel ?? pickLocale({ zh: '核心结果', en: 'Core Result' }, locale)} · {loveMeta?.name ?? result.name}</p>
                  </article>
                  <article className="ref-archive-drawer__fact">
                    <small>{pickLocale({ zh: '核心画像', en: 'Core Profile' }, locale)}</small>
                    <p>{result.summary}</p>
                  </article>
                  <article className="ref-archive-drawer__fact">
                    <small>{pickLocale({ zh: '风险点', en: 'Risk Signal' }, locale)}</small>
                    <p>{result.stressSignal}</p>
                  </article>
                  <article className="ref-archive-drawer__fact">
                    <small>{pickLocale({ zh: '修复方式', en: 'Repair Method' }, locale)}</small>
                    <p>{result.repairTip}</p>
                  </article>
                </div>

                <div className="ref-archive-drawer__prose">
                  {(archiveReading?.overview ?? simpleReading).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {(archiveReading?.scenario ?? [result.vibe, result.whyItHits]).filter(Boolean).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="ref-actions ref-archive-drawer__actions">
                  {detailHref ? (
                    <a className="ref-button ref-button--ghost" href={detailHref}>
                      {pickLocale({ zh: '打开独立页', en: 'Open Standalone Page' }, locale)}
                    </a>
                  ) : null}
                  <button className="ref-button ref-button--primary" onClick={handlePosterDownload} type="button">
                    {pickLocale({ zh: '分享此面', en: 'Share This Face' }, locale)}
                  </button>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}

      {sharePreviewOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-label={pickLocale({ zh: '分享图片预览', en: 'Share image preview' }, locale)}
              aria-modal="true"
              className="ref-share-preview-backdrop"
              onClick={() => setSharePreviewOpen(false)}
              role="dialog"
            >
              {currentPosterUrl ? (
                <div className="ref-share-preview__stage" onClick={(event) => event.stopPropagation()}>
                  <img
                    alt={pickLocale({ zh: `${loveMeta?.name ?? result.name} 分享图片预览`, en: `${loveMeta?.name ?? result.name} share image preview` }, locale)}
                    className="ref-share-preview__image"
                    src={currentPosterUrl}
                  />
                  <p className="ref-share-preview__hint">{pickLocale({ zh: '长按保存图片并转发', en: 'Long press to save and share' }, locale)}</p>
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
