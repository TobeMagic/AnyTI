import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getTypeDetailHref } from '@/lib/routes';
import { getLoveFace, getLoveFaceThumbPath, getLoveMeta, loveFaceTabs } from '@/lib/lbti-showcase';

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
          <h1>{pickLocale({ zh: '🫧 16 只恋爱小怪物图鉴', en: '🫧 16 Love Creature Profiles' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '💘 每只都有自嘲面、动物面和甜心面三种状态。先认领你的同类，再去测试看系统会把你分到哪一只。',
                en: 'Each type includes a self-mock face, an animal face, and a sweet face. Browse first, then take the test to see which one catches you.',
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
                  <div className="ref-type-card__faces" aria-label={pickLocale({ zh: '三面人格预览', en: 'Three-face preview' }, locale)}>
                    {loveFaceTabs.map((tab) => {
                      const face = getLoveFace(personality.id, tab.key);
                      return (
                        <div className="ref-type-card__face" key={tab.key}>
                          <PlaceholderPortrait
                            accent="#d36d4b"
                            imagePath={getLoveFaceThumbPath(personality.id, tab.key)}
                            imageLoading="lazy"
                            label={face?.name ?? personality.name}
                            size="58px"
                            soft="#f7dfd4"
                          />
                          <span>{tab.label}</span>
                        </div>
                      );
                    })}
                  </div>
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
