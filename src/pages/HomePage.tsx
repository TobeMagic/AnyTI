import type { CSSProperties } from 'react';
import { categories, getTestsForCategory, testPacks } from '@/lib/content';
import { getCategoryHref, getTestHref } from '@/lib/routes';
import { SiteChrome } from '@/components/SiteChrome';

export function HomePage() {
  const liveTests = categories.flatMap((category) =>
    getTestsForCategory(category.id).filter((test) => test.status === 'live'),
  );
  const liveTypeCards = Object.values(testPacks)
    .flatMap((pack) => {
      const category = categories.find((entry) => entry.id === pack.meta.category);
      if (!category) return [];

      return pack.personalities.slice(0, 3).map((personality) => ({
        personality,
        slug: pack.meta.slug,
        theme: category.theme,
      }));
    })
    .slice(0, 6);

  return (
    <div className="page-shell page-shell--home">
      <SiteChrome />
      <main className="page-shell__main">
        <section className="hero hero--matrix">
          <div>
            <p className="eyebrow">BTI Matrix Playground</p>
            <h1>
              先选你想看的生活切面，
              <br />
              再把它测成一张愿意转发的人格卡。
            </h1>
            <p className="hero__lede">
              不是只有一个测试页面，而是一整套可复制的 BTI 矩阵。每个类别先有自己的
              主题入口，再落到具体测试，把浏览变成接力。
            </p>
          </div>
          <div className="hero__aside">
            <div className="stat-card">
              <strong>{liveTests.length}</strong>
              <span>已上线测试</span>
            </div>
            <div className="stat-card">
              <strong>{categories.length}</strong>
              <span>类别入口</span>
            </div>
            <div className="stat-card">
              <strong>30</strong>
              <span>已锁 v1 requirement</span>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <h2>先选一个切面</h2>
            <p>每个入口都是一个小型主题主页，而不是冷冰冰的测试目录。</p>
          </div>
          <div className="category-grid" data-testid="home-category-grid">
            {categories.map((category) => {
              const tests = getTestsForCategory(category.id);
              const liveCount = tests.filter((test) => test.status === 'live').length;
              return (
                <a
                  className="category-card"
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
                  <span className="category-card__eyebrow">{category.slug.toUpperCase()}</span>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                  <div className="category-card__footer">
                    <span>{liveCount > 0 ? `${liveCount} 个已上线测试` : '筹备中'}</span>
                    <span>进入这个类别</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <h2>最容易被截图的标签</h2>
            <p>结果名册提前露出，用户才会更像在逛一个可比较、可转发的状态库。</p>
          </div>
          <div className="type-wall" data-testid="home-type-wall">
            {liveTypeCards.map(({ personality, slug, theme }) => (
              <a
                className="type-wall__card"
                href={getTestHref(slug)}
                key={`${slug}-${personality.id}`}
                style={
                  {
                    '--accent': theme.accent,
                    '--accent-soft': theme.accentSoft,
                    '--surface': theme.surface,
                    '--ink': theme.ink,
                  } as CSSProperties
                }
              >
                <p className="eyebrow">{slug.toUpperCase()}</p>
                <h3>{personality.name}</h3>
                <p>{personality.vibe}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
