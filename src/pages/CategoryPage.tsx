import type { CSSProperties } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { getCategoryBySlug, getPackPreviewById, getTestsForCategory } from '@/lib/content';
import { getTestHref } from '@/lib/routes';

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
  const typeShowcase = tests
    .flatMap((test) => getPackPreviewById(test.id)?.personalities.slice(0, 6) ?? [])
    .slice(0, 6);

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
        <section className="hero hero--category">
          <div>
            <p className="eyebrow">Category Page</p>
            <h1>{category.title}</h1>
            <p className="hero__lede">{category.subtitle}</p>
          </div>
          <div className="theme-token-card">
            <span>当前类别主题</span>
            <strong>{category.theme.accent}</strong>
            <small>共享版式，独立情绪色</small>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <h2>{tests.some((test) => test.status === 'live') ? '先从这里进测试' : '这个类别正在长出来'}</h2>
            <p>类别页不是中转站，而是这个切面的情绪首页。</p>
          </div>
          <div className="test-grid">
            {tests.map((test) => {
              const preview = getPackPreviewById(test.id);
              return (
                <article className={`test-card ${test.status === 'upcoming' ? 'is-upcoming' : ''}`} key={test.id}>
                  <p className="eyebrow">{test.status === 'live' ? 'Live now' : 'Coming soon'}</p>
                  <h3>{test.title}</h3>
                  <p>{test.teaser}</p>
                  {preview ? (
                    <div className="chip-row">
                      {preview.personalities.slice(0, 3).map((personality) => (
                        <span className="type-chip" key={personality.id}>
                          {personality.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {test.status === 'live' ? (
                    <a className="primary-button primary-button--link" href={getTestHref(test.slug)}>
                      进入 {test.slug.toUpperCase()}
                    </a>
                  ) : (
                    <span className="ghost-pill">先看别的入口</span>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {typeShowcase.length ? (
          <section className="section-block">
            <div className="section-heading">
              <h2>这类测试会产出什么标签</h2>
              <p>先把这条赛道的结果列表亮出来，点击动机会比空 CTA 更强。</p>
            </div>
            <div className="type-wall" data-testid="category-type-wall">
              {typeShowcase.map((personality) => (
                <article className="type-wall__card" key={personality.id}>
                  <p className="eyebrow">{personality.badge}</p>
                  <h3>{personality.name}</h3>
                  <p>{personality.vibe}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
