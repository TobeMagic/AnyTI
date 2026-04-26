import { useEffect, useRef, useState } from 'react';
import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { localizePack } from '@/lib/content-localization';
import { addImagePreloadLinks, scheduleImagePreload } from '@/lib/image-preload';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import {
  getAdjacentLoveFace,
  getLoveFaceThumbPath,
  loveFaceTabs,
} from '@/lib/lbti-showcase';
import { getLocalizedLoveFace, getLocalizedLoveLeaderboard, getLocalizedLoveMeta } from '@/lib/lbti-localization';
import type { LoveFaceKey } from '@/lib/lbti-showcase';
import type { Personality } from '@/lib/types';

const RANK_FLIP_DURATION_MS = 540;

type RankingEntry = ReturnType<typeof getLocalizedLoveLeaderboard>[number];
type RankingTypeFlipProps = {
  entry: RankingEntry;
  index: number;
  locale: 'zh' | 'en';
  personality: Personality;
};

type RankingFlipState = {
  from: LoveFaceKey;
  to: LoveFaceKey;
};

function RankingTypeFlip({ entry, index, locale, personality }: RankingTypeFlipProps) {
  const [activeFace, setActiveFace] = useState<LoveFaceKey>('selfMock');
  const [flip, setFlip] = useState<RankingFlipState | null>(null);
  const [resetting, setResetting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      frameRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
    };
  }, []);

  function finishFlip(nextFace: LoveFaceKey) {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    frameRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
    frameRef.current = [];

    setActiveFace(nextFace);
    setFlip(null);
    setResetting(true);

    const firstFrame = window.requestAnimationFrame(() => {
      const secondFrame = window.requestAnimationFrame(() => {
        setResetting(false);
        frameRef.current = [];
      });
      frameRef.current = [firstFrame, secondFrame];
    });
    frameRef.current = [firstFrame];
  }

  function rotateFace() {
    if (flip) return;

    const nextFace = getAdjacentLoveFace(activeFace, 'next');
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setActiveFace(nextFace);
      return;
    }

    setFlip({ from: activeFace, to: nextFace });
    timerRef.current = window.setTimeout(() => finishFlip(nextFace), RANK_FLIP_DURATION_MS);
  }

  function renderFace(faceKey: LoveFaceKey, eager: boolean) {
    const meta = getLocalizedLoveMeta(entry.id, locale);
    const face = getLocalizedLoveFace(entry.id, faceKey, locale);
    const faceNumber = loveFaceTabs.findIndex((tab) => tab.key === faceKey) + 1;

    return (
      <div className="ref-rank-face-flip__content">
        <div className="ref-rank-row__thumb">
          <PlaceholderPortrait
            accent="#d36d4b"
            imageFetchPriority={eager ? 'high' : 'auto'}
            imageLoading="eager"
            imagePath={getLoveFaceThumbPath(entry.id, faceKey)}
            label={face?.name ?? meta?.name ?? personality.name}
            size="52px"
            soft="#f7dfd4"
          />
        </div>
        <div className="ref-rank-face-flip__copy">
          <strong>{face?.icon ?? meta?.emoji} {face?.code ?? meta?.code}</strong>
          <b>{face?.icon ?? meta?.emoji} {face?.name ?? meta?.name ?? personality.name}</b>
          <p>{face?.quote ?? entry.note}</p>
          <small>
            {pickLocale({ zh: `点击翻面 · 第 ${faceNumber}/3 面`, en: `Tap to flip · ${faceNumber}/3` }, locale)}
          </small>
        </div>
      </div>
    );
  }

  const frontFace = flip?.from ?? activeFace;
  const backFace = flip?.to ?? getAdjacentLoveFace(activeFace, 'next');

  return (
    <button
      aria-label={pickLocale({ zh: `切换 ${personality.name} 的展示面`, en: `Flip ${personality.name}` }, locale)}
      className={`ref-rank-row__type ref-rank-row__type--flip ref-rank-row__type--${activeFace}`}
      disabled={Boolean(flip)}
      onClick={rotateFace}
      type="button"
    >
      <div
        className={`ref-rank-face-flip__inner ${flip ? 'is-flipping' : ''} ${resetting ? 'is-resetting' : ''}`}
        onTransitionEnd={(event) => {
          if (event.currentTarget === event.target && event.propertyName === 'transform' && flip) {
            finishFlip(flip.to);
          }
        }}
      >
        <div className="ref-rank-face-flip__side ref-rank-face-flip__side--front">
          {renderFace(frontFace, index < 6)}
        </div>
        {flip ? (
          <div className="ref-rank-face-flip__side ref-rank-face-flip__side--back">
            {renderFace(backFace, false)}
          </div>
        ) : null}
      </div>
    </button>
  );
}

export function RankingsPage() {
  const locale = getPreferredLocale();
  const rawPack = getPackBySlug('lbti');
  const pack = rawPack ? localizePack(rawPack, locale) : undefined;
  const leaderboard = getLocalizedLoveLeaderboard(locale);
  const visibleTypes = pack ? getVisiblePersonalities(pack.personalities) : [];
  const thumbnailUrls = leaderboard.flatMap((entry) =>
    loveFaceTabs.map((tab) => getLoveFaceThumbPath(entry.id, tab.key)),
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

  return (
    <div className="ref-shell">
      <SiteChrome current="rankings" />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{pickLocale({ zh: '🏅 热度排行榜', en: '🏅 Popularity Ranking' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '当前为 LBTI 公开热度分布，数据持续更新。点击任意人格可切换自嘲面、动物面和甜心面。',
                en: 'Current LBTI public popularity distribution, updated continuously. Tap any type to switch faces.',
              },
              locale,
            )}
          </p>
        </section>

        <section className="ref-rank-table ref-rank-table--page">
          <header className="ref-rank-head">
            <span>{pickLocale({ zh: '排名', en: 'Rank' }, locale)}</span>
            <span>{pickLocale({ zh: '人格类型', en: 'Type' }, locale)}</span>
            <span>{pickLocale({ zh: '占比', en: 'Bar' }, locale)}</span>
            <span>{pickLocale({ zh: '比例', en: 'Share' }, locale)}</span>
          </header>
          {leaderboard.map((entry, index) => {
            const personality = visibleTypes.find((item) => item.id === entry.id);
            if (!personality) return null;

            return (
              <article className="ref-rank-row ref-rank-row--page" key={entry.id}>
                <span className="ref-rank-row__index">{index + 1}</span>
                <RankingTypeFlip entry={entry} index={index} locale={locale} personality={personality} />
                <div className="ref-rank-row__bar">
                  <span style={{ width: entry.share }} />
                </div>
                <em>{entry.share}</em>
              </article>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
