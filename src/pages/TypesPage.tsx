import { useEffect, useRef, useState } from 'react';
import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { localizePack } from '@/lib/content-localization';
import { addImagePreloadLinks, scheduleImagePreload } from '@/lib/image-preload';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getTypeDetailHref } from '@/lib/routes';
import { getAdjacentLoveFace, getLoveFaceThumbPath } from '@/lib/lbti-showcase';
import { getLocalizedLoveFace, getLocalizedLoveFaceTabs, getLocalizedLoveMeta } from '@/lib/lbti-localization';
import type { LoveFaceKey } from '@/lib/lbti-showcase';

const FLIP_DURATION_MS = 540;

type FlipState = {
  from: LoveFaceKey;
  to: LoveFaceKey;
};

export function TypesPage() {
  const locale = getPreferredLocale();
  const rawPack = getPackBySlug('lbti');
  const pack = rawPack ? localizePack(rawPack, locale) : undefined;
  const [activeFaces, setActiveFaces] = useState<Record<string, LoveFaceKey>>({});
  const [flippingFaces, setFlippingFaces] = useState<Record<string, FlipState>>({});
  const [resettingFaces, setResettingFaces] = useState<Record<string, boolean>>({});
  const flipTimers = useRef<Record<string, number>>({});
  const resetFrames = useRef<Record<string, number[]>>({});

  useEffect(() => {
    return () => {
      Object.values(flipTimers.current).forEach((timer) => window.clearTimeout(timer));
      Object.values(resetFrames.current).forEach((frames) => frames.forEach((frame) => window.cancelAnimationFrame(frame)));
    };
  }, []);

  const visibleTypes = pack ? [...getVisiblePersonalities(pack.personalities)].sort((a, b) => {
    const ah = getLocalizedLoveMeta(a.id, locale)?.heat ?? 999;
    const bh = getLocalizedLoveMeta(b.id, locale)?.heat ?? 999;
    return ah - bh;
  }) : [];
  const thumbnailUrls = visibleTypes.flatMap((personality) =>
    getLocalizedLoveFaceTabs(locale).map((tab) => getLoveFaceThumbPath(personality.id, tab.key)),
  );
  const thumbnailPreloadKey = thumbnailUrls.filter(Boolean).join('|');

  useEffect(() => {
    const removeLinks = addImagePreloadLinks(thumbnailUrls, { fetchPriority: 'high' });
    const cancelWarmup = scheduleImagePreload(thumbnailUrls, { fetchPriority: 'high' });

    return () => {
      removeLinks?.();
      cancelWarmup?.();
    };
  }, [thumbnailPreloadKey]);

  if (!pack) return null;

  function getActiveFace(personalityId: string) {
    return activeFaces[personalityId] ?? 'selfMock';
  }

  function rotateFace(personalityId: string) {
    if (flippingFaces[personalityId]) return;

    const currentFace = activeFaces[personalityId] ?? 'selfMock';
    const nextFace = getAdjacentLoveFace(currentFace, 'next');
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setActiveFaces((previous) => ({
        ...previous,
        [personalityId]: nextFace,
      }));
      return;
    }

    setFlippingFaces((previous) => ({
      ...previous,
      [personalityId]: {
        from: currentFace,
        to: nextFace,
      },
    }));

    if (flipTimers.current[personalityId]) {
      window.clearTimeout(flipTimers.current[personalityId]);
    }

    flipTimers.current[personalityId] = window.setTimeout(() => {
      finishFlip(personalityId, nextFace);
    }, FLIP_DURATION_MS);
  }

  function renderFace(personality: (typeof visibleTypes)[number], faceKey: LoveFaceKey, eager: boolean) {
    const meta = getLocalizedLoveMeta(personality.id, locale);
    const face = getLocalizedLoveFace(personality.id, faceKey, locale);
    const faceNumber = getLocalizedLoveFaceTabs(locale).findIndex((tab) => tab.key === faceKey) + 1;

    return (
      <>
        <small>{face?.icon ?? meta?.emoji} {face?.code ?? meta?.code}</small>
        <div className="ref-type-card__art">
          <PlaceholderPortrait
            accent="#d36d4b"
            imageFetchPriority={eager ? 'high' : 'auto'}
            imageLoading="eager"
            imagePath={getLoveFaceThumbPath(personality.id, faceKey)}
            label={face?.name ?? personality.name}
            size="88px"
            soft="#f7dfd4"
          />
        </div>
        <div className="ref-type-card__copy">
          <h2>{face?.icon ?? meta?.emoji} {face?.name ?? personality.name}</h2>
          <strong>{face?.faceLabel ?? '当前展示'} · 第 {faceNumber}/3 面</strong>
          <p>{face?.quote ?? meta?.quote ?? personality.vibe}</p>
        </div>
        <span className="ref-type-card__flip-hint">
          {pickLocale({ zh: '点击翻面', en: 'Tap to flip' }, locale)}
        </span>
      </>
    );
  }

  function handleFlipTransitionEnd(personalityId: string) {
    const flip = flippingFaces[personalityId];
    if (!flip) return;

    finishFlip(personalityId, flip.to);
  }

  function finishFlip(personalityId: string, nextFace: LoveFaceKey) {
    if (flipTimers.current[personalityId]) {
      window.clearTimeout(flipTimers.current[personalityId]);
      delete flipTimers.current[personalityId];
    }

    if (resetFrames.current[personalityId]) {
      resetFrames.current[personalityId].forEach((frame) => window.cancelAnimationFrame(frame));
    }

    setActiveFaces((previous) => ({
      ...previous,
      [personalityId]: nextFace,
    }));
    setFlippingFaces((previous) => {
      const next = { ...previous };
      delete next[personalityId];
      return next;
    });
    setResettingFaces((previous) => ({
      ...previous,
      [personalityId]: true,
    }));

    const firstFrame = window.requestAnimationFrame(() => {
      const secondFrame = window.requestAnimationFrame(() => {
        setResettingFaces((previous) => {
          const next = { ...previous };
          delete next[personalityId];
          return next;
        });
        delete resetFrames.current[personalityId];
      });
      resetFrames.current[personalityId] = [firstFrame, secondFrame];
    });
    resetFrames.current[personalityId] = [firstFrame];
  }

  return (
    <div className="ref-shell">
      <SiteChrome current="types" />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{pickLocale({ zh: '🫧 16 种恋爱角色档案', en: '🫧 16 Love Role Profiles' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '💘 每个角色都有自嘲面、动物面和甜心面三种状态。点击任意角色单独翻面，先认领你的同类，再去测试看系统会把你分到哪一型。',
                en: 'Each role has a self-mock face, an animal face, and a sweet face. Tap any card to flip that role, then take the test to see which one catches you.',
              },
              locale,
            )}
          </p>
        </section>

        <section className="ref-type-grid">
          {visibleTypes.map((personality) => {
            const meta = getLocalizedLoveMeta(personality.id, locale);
            const activeFace = getActiveFace(personality.id);
            const flip = flippingFaces[personality.id];
            const frontFace = flip?.from ?? activeFace;
            const backFace = flip?.to ?? getAdjacentLoveFace(activeFace, 'next');
            return (
              <article className={`ref-type-card ref-type-card--single ref-type-card--${activeFace}`} key={personality.id}>
                <button
                  aria-label={pickLocale({ zh: `切换 ${meta?.name ?? personality.name} 的展示面`, en: `Flip ${meta?.name ?? personality.name}` }, locale)}
                  className="ref-type-card__flip-trigger"
                  disabled={Boolean(flip)}
                  onClick={() => rotateFace(personality.id)}
                  type="button"
                >
                  <div
                    className={`ref-type-card__flip-inner ${flip ? 'is-flipping' : ''} ${resettingFaces[personality.id] ? 'is-resetting' : ''}`}
                    onTransitionEnd={(event) => {
                      if (event.currentTarget === event.target && event.propertyName === 'transform') {
                        handleFlipTransitionEnd(personality.id);
                      }
                    }}
                  >
                    <div className="ref-type-card__flip-side ref-type-card__flip-side--front">
                      <div className="ref-type-card__flip-face">
                        {renderFace(personality, frontFace, frontFace === 'selfMock')}
                      </div>
                    </div>
                    {flip ? (
                      <div className="ref-type-card__flip-side ref-type-card__flip-side--back">
                        <div className="ref-type-card__flip-face">
                          {renderFace(personality, backFace, false)}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </button>
                <a className="ref-type-card__cta" href={getTypeDetailHref(meta?.routeSlug ?? personality.slug)}>
                  {pickLocale({ zh: '🔍 查看详情', en: '🔍 View Detail' }, locale)}
                </a>
              </article>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
