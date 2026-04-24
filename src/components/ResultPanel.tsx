import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildLbtiReport } from '@/lib/lbti-report';
import { getAdjacentLoveFace, getLoveArchiveReading, getLoveFace, getLoveFaceImagePath, getLoveMeta, loveFaceTabs } from '@/lib/lbti-showcase';
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
  const [status, setStatus] = useState('');
  const [activeFace, setActiveFace] = useState<'selfMock' | 'animal' | 'sweet'>('selfMock');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(false);
  const [posterUrls, setPosterUrls] = useState<Partial<Record<'selfMock' | 'animal' | 'sweet', string>>>({});
  const [posterLoading, setPosterLoading] = useState<Partial<Record<'selfMock' | 'animal' | 'sweet', boolean>>>({});
  const [viewedFaces, setViewedFaces] = useState<Array<'selfMock' | 'animal' | 'sweet'>>(['selfMock']);
  const touchStartX = useRef<number | null>(null);
  const posterUrlRef = useRef<Partial<Record<'selfMock' | 'animal' | 'sweet', string>>>({});
  const loveMeta = pack.meta.slug === 'lbti' ? getLoveFace(result.id, activeFace) : undefined;
  const baseMeta = pack.meta.slug === 'lbti' ? getLoveMeta(result.id) : undefined;
  const archiveReading = pack.meta.slug === 'lbti' ? getLoveArchiveReading(result, activeFace) : undefined;
  const report = buildLbtiReport(dimensions, result);
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
    if (typeof document === 'undefined') return undefined;

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    if (sharePreviewOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      if (sharePreviewOpen) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [drawerOpen, sharePreviewOpen]);

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
    const face = pack.meta.slug === 'lbti' ? getLoveFace(result.id, faceKey) : undefined;
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
      setStatus('正在准备图片…');
      const url = await ensurePoster(activeFace);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${pack.meta.slug}-${result.slug}-${activeFace}.png`;
      anchor.click();
      setStatus('图片已准备好，可以保存转发。');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '图片导出失败。');
    }
  }

  async function handleOpenSharePreview() {
    try {
      setStatus('正在准备图片…');
      await ensurePoster(activeFace);
      setSharePreviewOpen(true);
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '图片预览失败。');
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

  return (
    <section className="result-panel result-panel--report result-panel--archive" data-testid="result-panel">
      <section className="ref-triptych-stage result-triptych-stage">
        <div className="ref-triptych-stage__head">
          <p className="ref-type-detail-hero__eyebrow">你的爱情人格</p>
          <h2 className="ref-triptych-stage__title">原来你有三副面孔</h2>
          <p className="ref-triptych-stage__lede">转动卡片，看见你的另一面。</p>
        </div>

        <div
          className="ref-triptych-poster-stage"
          onTouchEnd={(event) => handleFaceSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}
          onTouchStart={(event) => handleFaceSwipeStart(event.touches[0]?.clientX ?? 0)}
        >
          <button
            aria-label="切换到上一面"
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
                  alt={`${loveMeta?.name ?? result.name} 分享图片`}
                  className="ref-triptych-poster__image"
                  data-testid="result-image-card"
                  src={currentPosterUrl}
                />
              ) : (
                <div className={`ref-triptych-card ref-triptych-card--${activeFace} ref-triptych-card--poster-placeholder`}>
                  <span className="ref-triptych-card__watermark" aria-hidden="true">{loveMeta?.code ?? pack.meta.slug.toUpperCase()}</span>
                  <span className="ref-triptych-card__ribbon">{loveMeta?.faceLabel ?? '当前展示'}</span>
                  <span className="ref-triptych-card__stamp">MATCH {match}%</span>
                  <figure className="ref-triptych-card__portrait">
                    <PlaceholderPortrait
                      accent={category.theme.accent}
                      soft={category.theme.accentSoft}
                      label={loveMeta?.name ?? result.name}
                      imagePath={getLoveFaceImagePath(result.id, activeFace)}
                      size="240px"
                    />
                    <figcaption className="ref-triptych-card__image-caption">角色插画</figcaption>
                  </figure>
                  <small className="ref-triptych-card__face">{loveMeta?.icon} {loveMeta?.faceLabel ?? '当前展示'}</small>
                  <h2 className="ref-triptych-card__code result-panel__name--report" data-testid="result-name">
                    {loveMeta?.code ?? pack.meta.slug.toUpperCase()}
                  </h2>
                  <h3 className="ref-triptych-card__name">{loveMeta?.name ?? result.name}</h3>
                  <blockquote className="ref-triptych-card__quote">{isCurrentPosterLoading ? '正在生成分享图…' : loveMeta?.quote ?? result.vibe}</blockquote>
                </div>
              )}
            </button>
            <p className="ref-triptych-poster__hint">
              {loveMeta?.icon} {loveMeta?.faceLabel ?? '当前展示'} · 点击图片保存转发 · 左右切换另一面
            </p>
          </div>
          <button
            aria-label="切换到下一面"
            className="ref-triptych-stage__nav ref-triptych-stage__nav--next"
            onClick={() => setActiveFace((previous) => getAdjacentLoveFace(previous, 'next'))}
            type="button"
          >
            →
          </button>
        </div>

        <div className="ref-triptych-stage__meta">
          <strong className="result-panel__matchline" data-testid="result-name">
            你的主类型 · 匹配度 {match}% · 当前展示 {loveMeta?.faceLabel ?? '核心结果'} · 精准命中 {report.matchedCount}/{report.total} 维
          </strong>
          <p className="result-panel__verdict">{report.verdict}</p>
        </div>

        <div className="ref-actions result-actions result-actions--report result-actions--triptych">
          <button className="ref-button ref-button--ghost" onClick={() => setDrawerOpen(true)} type="button">
            查看完整档案
          </button>
          <button className="ref-button ref-button--primary" onClick={handleOpenSharePreview} type="button">
            分享图片
          </button>
          <button className="ref-button ref-button--ghost" onClick={onRestart} type="button">
            重新测试
          </button>
          <a className="ref-button ref-button--ghost" href={getHomeHref()}>
            回到首页
          </a>
        </div>
        {hasSeenAllFaces ? (
          <p className="ref-triptych-stage__toast">自嘲是你的保护色，动物是你的本能，而甜心是你值得被爱的证明。</p>
        ) : null}
        {status ? <p className="ref-type-detail-note result-status result-status--archive">{status}</p> : null}
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>{loveMeta?.faceLabel ?? '当前展示'} · 官方速读</h2>
        </div>
        <div className="ref-type-detail-prose">
          {(archiveReading?.overview ?? simpleReading).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>真实场景</h2>
        </div>
        <div className="ref-type-detail-prose">
          {(archiveReading?.scenario ?? [result.vibe, result.repairTip ?? result.whyItHits]).filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>🧬 这只的六维切面</h2>
        </div>
        <div className="ref-type-detail-dimensions result-score-list">
          {report.items.map((item) => (
            <article className="ref-type-detail-dimension result-score-item" key={item.key}>
              <header>
                <strong>{item.code} {item.title}</strong>
                <span>{item.band} / {item.points}分</span>
              </header>
              <div className="result-dimension-meter" aria-hidden="true">
                <span className="result-dimension-meter__label result-dimension-meter__label--left">
                  {dimensions.find((entry) => entry.key === item.key)?.leftLabel ?? '左侧'}
                </span>
                <div className="result-dimension-meter__track">
                  <span className="result-dimension-meter__midline" />
                  <span className="result-dimension-meter__dot" style={{ left: `${Math.max(8, Math.min(92, ((item.score + 100) / 200) * 100))}%` }} />
                </div>
                <span className="result-dimension-meter__label result-dimension-meter__label--right">
                  {dimensions.find((entry) => entry.key === item.key)?.rightLabel ?? '右侧'}
                </span>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ref-section result-report-section result-report-section--archive">
        <div className="ref-section__head">
          <h2>📌 友情提示</h2>
        </div>
        <p className="ref-type-detail-note result-report-section__prose">{pack.meta.methodology.disclaimer}</p>
      </section>

      {nearby.length ? (
        <section className="ref-section result-report-section result-report-section--archive">
          <div className="ref-section__head">
            <h2>🪄 继续浏览</h2>
          </div>
          <div className="ref-type-continue-grid">
            {nearby.slice(0, 4).map((entry) => {
              const relatedMeta = getLoveMeta(entry.personality.id);
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

      {drawerOpen ? (
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
                <p className="ref-type-detail-hero__eyebrow">完整档案</p>
                <h3 className="ref-archive-drawer__title" id="lbti-archive-drawer-title">
                  {loveMeta?.code ?? result.badge.split('/')[0]?.trim() ?? 'LBTI'} · {loveMeta?.name ?? result.name}
                </h3>
              </div>
              <button
                aria-label="关闭完整档案"
                className="ref-archive-drawer__close"
                onClick={() => setDrawerOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <p className="ref-archive-drawer__quote">{loveMeta?.quote ?? result.vibe}</p>

            <div className="ref-archive-drawer__grid">
              <article className="ref-archive-drawer__fact">
                <small>核心画像</small>
                <p>{result.summary}</p>
              </article>
              <article className="ref-archive-drawer__fact">
                <small>发光点</small>
                <p>{result.sweetSpot}</p>
              </article>
              <article className="ref-archive-drawer__fact">
                <small>风险点</small>
                <p>{result.stressSignal}</p>
              </article>
              <article className="ref-archive-drawer__fact">
                <small>修复方式</small>
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
                  打开独立页
                </a>
              ) : null}
              <button className="ref-button ref-button--primary" onClick={handlePosterDownload} type="button">
                分享此面
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {sharePreviewOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-label="分享图片预览"
              aria-modal="true"
              className="ref-share-preview-backdrop"
              onClick={() => setSharePreviewOpen(false)}
              role="dialog"
            >
              {currentPosterUrl ? (
                <img
                  alt={`${loveMeta?.name ?? result.name} 分享图片预览`}
                  className="ref-share-preview__image"
                  onClick={(event) => event.stopPropagation()}
                  src={currentPosterUrl}
                />
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
