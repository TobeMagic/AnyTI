import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getStartTestHref, getTypeDetailHref, getTypesHref } from '@/lib/routes';
import { getLoveMeta, mbtiProfiles } from '@/lib/lbti-showcase';

export function CrossAnalysisPage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  if (!pack) return null;

  const visibleTypes = getVisiblePersonalities(pack.personalities).sort((a, b) => {
    const left = getLoveMeta(a.id)?.heat ?? 999;
    const right = getLoveMeta(b.id)?.heat ?? 999;
    return left - right;
  });

  return (
    <div className="ref-shell">
      <SiteChrome current="analysis" />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{pickLocale({ zh: '🧬 16 种 LBTI × 16 种 MBTI = 256 组人格交叉解析', en: '🧬 16 LBTI × 16 MBTI = 256 Cross Reads' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '这个专区把 LBTI 的 16 个恋爱角色和 MBTI 的经典 16 型放在同一张坐标系里看，方便你直接按类型展开浏览。',
                en: 'This archive places the 16 LBTI love roles and the classic 16 MBTI types on one browsing map.',
              },
              locale,
            )}
          </p>
          <div className="ref-actions">
            <a className="ref-button ref-button--primary" href={getStartTestHref()}>
              {pickLocale({ zh: '先去测试', en: 'Take the Test' }, locale)}
            </a>
            <a className="ref-button ref-button--ghost" href={getTypesHref()}>
              {pickLocale({ zh: '浏览 LBTI 类型', en: 'Browse Types' }, locale)}
            </a>
          </div>
        </section>

        <section className="ref-section ref-section--tight">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '🧭 快速定位你的 LBTI 类型', en: '🧭 Quick Type Locator' }, locale)}</h2>
          </div>
          <section className="ref-anchor-cloud">
          {visibleTypes.map((personality) => (
            <a href={`#${personality.slug}`} key={personality.id}>
              {getLoveMeta(personality.id)?.code ?? personality.name}
            </a>
          ))}
          </section>
        </section>

        <section className="ref-section ref-section--tight">
          <div className="ref-section__head">
            <h2>{pickLocale({ zh: '📚 按 LBTI 分组浏览', en: '📚 Browse by LBTI Type' }, locale)}</h2>
          </div>
          <div className="ref-cross-groups">
          {visibleTypes.map((personality) => (
            <article className="ref-cross-group" id={personality.slug} key={personality.id}>
              <header className="ref-cross-group__head">
                <small>{getLoveMeta(personality.id)?.emoji} {getLoveMeta(personality.id)?.code}</small>
                <h2>{getLoveMeta(personality.id)?.emoji} {getLoveMeta(personality.id)?.name ?? personality.name}</h2>
                <p>💬 {getLoveMeta(personality.id)?.quote ?? personality.badge}</p>
              </header>
              <div className="ref-cross-combo-grid">
                {mbtiProfiles.map((mbti) => (
                  <a className="ref-cross-combo" href={getTypeDetailHref(getLoveMeta(personality.id)?.routeSlug ?? personality.slug)} key={`${personality.id}-${mbti.code}`}>
                    <strong>
                      {getLoveMeta(personality.id)?.code} × {mbti.code}
                    </strong>
                    <b>
                      {(getLoveMeta(personality.id)?.name ?? personality.name)} + {mbti.zhName}
                    </b>
                    <p>🧠 {mbti.summary}</p>
                  </a>
                ))}
              </div>
            </article>
          ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
