import type { CSSProperties } from 'react';
import { groupPersonalities, getVisiblePersonalities } from '@/lib/archetypes';
import { categories, getCategoryBySlug, getPackBySlug, getTestsForCategory } from '@/lib/content';
import { getCategoryHref, getTestHref } from '@/lib/routes';
import { SiteChrome } from '@/components/SiteChrome';

export function HomePage() {
  const loveCategory = getCategoryBySlug('love');
  const lovePack = getPackBySlug('lbti');
  const liveTests = categories.flatMap((category) =>
    getTestsForCategory(category.id).filter((test) => test.status === 'live'),
  );
  const loveGroups = lovePack ? groupPersonalities(lovePack.personalities) : [];
  const loveFeatured = lovePack ? getVisiblePersonalities(lovePack.personalities).slice(0, 4) : [];

  return (
    <div
      className="page-shell page-shell--home"
      style={
        loveCategory
          ? ({
              '--accent': loveCategory.theme.accent,
              '--accent-soft': loveCategory.theme.accentSoft,
              '--surface': loveCategory.theme.surface,
              '--ink': loveCategory.theme.ink,
            } as CSSProperties)
          : undefined
      }
    >
      <SiteChrome />
      <main className="page-shell__main">
        <section className="hero hero--home-page">
          <div className="hero__copy">
            <p className="eyebrow">Love-first Edition 01</p>
            <h1>
              先别分析爱情，
              <br />
              先看你在关系里
              <br />
              到底是哪种活人。
            </h1>
            <p className="hero__lede">
              这一版直接按 `16Personalities` 的可信层级和 `SBTI` 的社交流量语法来做。
              首页是入口广场，但主角先给 `LBTI`。用户先逛名册、再进频道、最后进测试。
            </p>
            <div className="hero__actions">
              <a className="primary-button primary-button--link" href={getTestHref('lbti')}>
                先测 LBTI
              </a>
              <a className="ghost-button ghost-button--link" href={getCategoryHref('love')}>
                进入恋爱频道
              </a>
            </div>
          </div>

          <aside className="hero-side">
            <div className="stat-strip">
              <div className="stat-strip__item">
                <strong>{liveTests.length}</strong>
                <span>Live Tests</span>
              </div>
              <div className="stat-strip__item">
                <strong>30</strong>
                <span>Love Questions</span>
              </div>
              <div className="stat-strip__item">
                <strong>16</strong>
                <span>Love Types</span>
              </div>
              <div className="stat-strip__item">
                <strong>06</strong>
                <span>Love Models</span>
              </div>
            </div>

            <div className="hero-list">
              <p className="hero-list__label">恋爱频道热搜标签</p>
              {loveFeatured.map((personality) => (
                <div className="hero-list__item" key={personality.id}>
                  <strong>{personality.name}</strong>
                  <span>{personality.vibe}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>入口不是测试，是频道</h2>
            <p>主页负责挑起情绪和兴趣，类别页负责承接主题，测试页才负责给答案。这才像矩阵产品，不像散落问卷。</p>
          </div>
          <div className="channel-list" data-testid="home-category-grid">
            {categories.map((category) => {
              const tests = getTestsForCategory(category.id);
              const liveCount = tests.filter((test) => test.status === 'live').length;

              return (
                <a
                  className="channel-row"
                  href={getCategoryHref(category.slug)}
                  key={category.id}
                  style={
                    {
                      '--accent': category.theme.accent,
                      '--accent-soft': category.theme.accentSoft,
                      '--surface': category.theme.surface,
                      '--ink': category.theme.ink,
                    } as CSSProperties
                  }
                >
                  <div className="channel-row__title">
                    <p className="eyebrow">{category.slug.toUpperCase()}</p>
                    <strong>{category.title}</strong>
                  </div>
                  <p>{category.subtitle}</p>
                  <div className="channel-row__meta">
                    <span>{liveCount > 0 ? `${liveCount} 个已上线测试` : '筹备中'}</span>
                    <span>进入这个频道</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {lovePack ? (
          <section className="section-block section-block--clean">
            <div className="section-heading">
              <h2>LBTI 全部角色名册</h2>
              <p>先把角色体系定住，前端才有可展示的骨架。这里不是卡片墙，而是像官方站的类型名册。</p>
            </div>
            <div className="roster-board" data-testid="home-type-wall">
              {loveGroups.map(({ group, items }) => (
                <section className="roster-group" key={group}>
                  <div className="roster-group__header">
                    <p className="eyebrow">{group}</p>
                  </div>
                  <div className="roster-group__list">
                    {items.map((personality) => (
                      <article className="roster-row" key={personality.id}>
                        <div className="roster-row__title">
                          <strong>{personality.name}</strong>
                          <span>{personality.badge}</span>
                        </div>
                        <p>{personality.vibe}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : null}

        <section className="section-block section-block--clean">
          <div className="story-band">
            <article className="story-band__item">
              <small>为什么像 16P</small>
              <p>因为层级、可信度和方法说明必须像一个真正的官方产品站，而不是只靠一句梗撑全页。</p>
            </article>
            <article className="story-band__item">
              <small>为什么像 SBTI</small>
              <p>因为结果名必须能截图、能互相 @、能在群里一句话讲清楚自己是哪一挂。</p>
            </article>
            <article className="story-band__item">
              <small>为什么先做恋爱</small>
              <p>恋爱类最适合先验证角色命名、海报传播和手机端阅读节奏，打通后再复制到其他频道。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
