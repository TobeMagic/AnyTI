import { useState } from 'react';
import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getTypeDetailHref } from '@/lib/routes';
import { getAdjacentLoveFace, getLoveFace, getLoveFaceThumbPath, getLoveMeta, loveFaceTabs } from '@/lib/lbti-showcase';
import type { LoveFaceKey } from '@/lib/lbti-showcase';

export function TypesPage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  const [activeFaces, setActiveFaces] = useState<Record<string, LoveFaceKey>>({});
  if (!pack) return null;
  const visibleTypes = [...getVisiblePersonalities(pack.personalities)].sort((a, b) => {
    const ah = getLoveMeta(a.id)?.heat ?? 999;
    const bh = getLoveMeta(b.id)?.heat ?? 999;
    return ah - bh;
  });

  function getActiveFace(personalityId: string) {
    return activeFaces[personalityId] ?? 'selfMock';
  }

  function rotateFace(personalityId: string) {
    setActiveFaces((previous) => {
      const currentFace = previous[personalityId] ?? 'selfMock';
      return {
        ...previous,
        [personalityId]: getAdjacentLoveFace(currentFace, 'next'),
      };
    });
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
            const meta = getLoveMeta(personality.id);
            const activeFace = getActiveFace(personality.id);
            const face = getLoveFace(personality.id, activeFace);
            const faceNumber = loveFaceTabs.findIndex((tab) => tab.key === activeFace) + 1;
            return (
              <article className={`ref-type-card ref-type-card--single ref-type-card--${activeFace}`} key={personality.id}>
                <button
                  aria-label={pickLocale({ zh: `切换 ${face?.name ?? personality.name} 的展示面`, en: `Flip ${face?.name ?? personality.name}` }, locale)}
                  className="ref-type-card__flip-trigger"
                  onClick={() => rotateFace(personality.id)}
                  type="button"
                >
                  <div className="ref-type-card__flip-face" key={activeFace}>
                    <small>{face?.icon ?? meta?.emoji} {face?.code ?? meta?.code}</small>
                    <div className="ref-type-card__art">
                      <PlaceholderPortrait
                        accent="#d36d4b"
                        imageFetchPriority={faceNumber === 1 ? 'high' : 'auto'}
                        imageLoading="eager"
                        imagePath={getLoveFaceThumbPath(personality.id, activeFace)}
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
