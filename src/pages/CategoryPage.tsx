import type { CSSProperties } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { groupPersonalities, getVisiblePersonalities } from '@/lib/archetypes';
import { getCategoryBySlug, getPackPreviewById, getTestsForCategory } from '@/lib/content';
import { getHomeHref, getTestHref } from '@/lib/routes';

type CategoryPageProps = {
  slug: string;
};

export function CategoryPage({ slug }: CategoryPageProps) {
  const category = getCategoryBySlug(slug);
  if (!category) {
    return (
      <div className="page-shell">
        <SiteChrome />
        <main className="page-shell__main">
          <section className="section-block">
            <h1>这个类别还没接上</h1>
            <p>先回首页挑一个已经亮着的入口。</p>
          </section>
        </main>
      </div>
    );
  }

  const tests = getTestsForCategory(category.id);
  const liveTest = tests.find((test) => test.status === 'live');
  const livePack = liveTest ? getPackPreviewById(liveTest.id) : undefined;
  const visibleTypes = livePack ? getVisiblePersonalities(livePack.personalities) : [];
  const groupedTypes = livePack ? groupPersonalities(livePack.personalities) : [];
  const featuredTypes = visibleTypes.slice(0, 4);

  return (
    <div
      className="page-shell"
      style={
        {
          '--accent': category.theme.accent,
          '--accent-soft': category.theme.accentSoft,
          '--surface': category.theme.surface,
          '--ink': category.theme.ink,
        } as CSSProperties
      }
    >
      <SiteChrome currentCategorySlug={category.slug} />
      <main className="page-shell__main">
        <section className="hero hero--category-page">
          <div className="hero__copy">
            <p className="eyebrow">Category Channel</p>
            <h1>{category.title}</h1>
            <p className="hero__lede">{category.subtitle}</p>
            <div className="hero__actions">
              {liveTest ? (
                <a className="primary-button primary-button--link" href={getTestHref(liveTest.slug)}>
                  进入 {liveTest.slug.toUpperCase()}
                </a>
              ) : null}
              <a className="ghost-button ghost-button--link" href={getHomeHref()}>
                返回首页
              </a>
            </div>
          </div>

          <aside className="hero-side">
            <div className="stat-strip">
              <div className="stat-strip__item">
                <strong>{tests.filter((test) => test.status === 'live').length}</strong>
                <span>Live Tests</span>
              </div>
              <div className="stat-strip__item">
                <strong>{visibleTypes.length || '--'}</strong>
                <span>Visible Types</span>
              </div>
              <div className="stat-strip__item">
                <strong>{livePack?.meta.questionCount ?? '--'}</strong>
                <span>Questions</span>
              </div>
              <div className="stat-strip__item">
                <strong>{livePack?.meta.durationLabel ?? '--'}</strong>
                <span>Duration</span>
              </div>
            </div>

            {featuredTypes.length ? (
              <div className="hero-list">
                <p className="hero-list__label">频道代表角色</p>
                {featuredTypes.map((personality) => (
                  <div className="hero-list__item" key={personality.id}>
                    <strong>{personality.name}</strong>
                    <span>{personality.vibe}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </aside>
        </section>

        <section className="section-block section-block--clean">
          <div className="section-heading">
            <h2>{liveTest ? '先从这个测试进入频道' : '这个频道正在长出来'}</h2>
            <p>类别页应该像专题首页，不是简单的二级目录。先给主题、再给代表作、再给名册。</p>
          </div>
          <div className="recommendation-list">
            {tests.map((test) => (
              <article className={`recommendation-row ${test.status === 'upcoming' ? 'is-upcoming' : ''}`} key={test.id}>
                <div className="recommendation-row__copy">
                  <p className="eyebrow">{test.status === 'live' ? 'Live Now' : 'Coming Soon'}</p>
                  <strong>{test.title}</strong>
                  <span>{test.teaser}</span>
                </div>
                {test.status === 'live' ? (
                  <a className="primary-button primary-button--link" href={getTestHref(test.slug)}>
                    进入 {test.slug.toUpperCase()}
                  </a>
                ) : (
                  <span className="ghost-pill">筹备中</span>
                )}
              </article>
            ))}
          </div>
        </section>

        {groupedTypes.length ? (
          <section className="section-block section-block--clean">
            <div className="section-heading">
              <h2>这条频道会产出什么标签</h2>
              <p>把结果先做成一份好逛的名册，用户才会把“我想抽到哪型”带进答题流程里。</p>
            </div>
            <div className="roster-board" data-testid="category-type-wall">
              {groupedTypes.map(({ group, items }) => (
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

        {livePack ? (
          <section className="section-block section-block--clean">
            <div className="story-band">
              <article className="story-band__item">
                <small>频道核心钩子</small>
                <p>{livePack.meta.hook}</p>
              </article>
              <article className="story-band__item">
                <small>计分方式</small>
                <p>{livePack.meta.methodology.scoring}</p>
              </article>
              <article className="story-band__item">
                <small>解释边界</small>
                <p>{livePack.meta.methodology.disclaimer}</p>
              </article>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
