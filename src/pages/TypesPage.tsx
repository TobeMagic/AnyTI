import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getTypeDetailHref } from '@/lib/routes';
import { getLoveMeta, getLoveFaceImagePath } from '@/lib/lbti-showcase';

export function TypesPage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  if (!pack) return null;
  const visibleTypes = [...getVisiblePersonalities(pack.personalities)].sort((a, b) => {
    const ah = getLoveMeta(a.id)?.heat ?? 999;
    const bh = getLoveMeta(b.id)?.heat ?? 999;
    return ah - bh;
  });

  return (
    <div className="ref-shell">
      <SiteChrome current="types" />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{pickLocale({ zh: '🫧 全部 16 只恋爱小怪物', en: '🫧 All 16 Love Creatures' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '💘 这里展示 LBTI 的公开小怪物图鉴。先看看有没有你的同类，再决定要不要去测。',
                en: 'Browse the public LBTI creature archive first and see whether one of these types already feels familiar.',
              },
              locale,
            )}
          </p>
        </section>

        <section className="ref-type-grid">
          {visibleTypes.map((personality) => {
            const meta = getLoveMeta(personality.id);
            return (
              <a className="ref-type-card" href={getTypeDetailHref(meta?.routeSlug ?? personality.slug)} key={personality.id}>
                <small>{meta?.emoji} {meta?.code}</small>
                <div className="ref-type-card__art">
                  <PlaceholderPortrait accent="#d36d4b" soft="#f7dfd4" label={meta?.name ?? personality.name} imagePath={getLoveFaceImagePath(personality.id, 'selfMock')} size="84px" />
                </div>
                <div className="ref-type-card__copy">
                  <h2>{meta?.emoji} {meta?.name ?? personality.name}</h2>
                  <strong>🪞 {meta?.alias ?? personality.badge}</strong>
                  <p>{meta?.quote ?? personality.vibe}</p>
                </div>
                <span className="ref-type-card__cta">
                  {pickLocale({ zh: '🔍 查看详情', en: '🔍 View Detail' }, locale)}
                </span>
              </a>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
