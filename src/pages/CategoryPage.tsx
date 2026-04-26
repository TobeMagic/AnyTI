import type { CSSProperties } from 'react';
import { HomePage } from '@/pages/HomePage';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getCategoryBySlug, getTestsForCategory } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';

type CategoryPageProps = {
  slug: string;
};

export function CategoryPage({ slug }: CategoryPageProps) {
  const locale = getPreferredLocale();
  const category = getCategoryBySlug(slug);

  if (slug === 'love') {
    return <HomePage />;
  }

  if (!category) {
    return (
      <div className="ref-shell">
        <SiteChrome />
        <main className="ref-page ref-page--sub">
          <section className="ref-centered-hero">
            <h1>{pickLocale({ zh: '这个类别还没接上', en: 'This category is not connected yet' }, locale)}</h1>
            <p>{pickLocale({ zh: '先回首页挑一个已经亮着的入口。', en: 'Return home and choose an available entrance first.' }, locale)}</p>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const tests = getTestsForCategory(category.id);

  return (
    <div
      className="ref-shell"
      style={
        {
          '--ref-accent': category.theme.accent,
        } as CSSProperties
      }
    >
      <SiteChrome />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{category.title}</h1>
          <p>{category.subtitle}</p>
        </section>
        <section className="ref-directory">
          {tests.map((test) => (
            <article className="ref-directory-row" key={test.id}>
              <div className="ref-directory-row__copy">
                <small>{test.status === 'live' ? 'LIVE' : 'SOON'}</small>
                <h2>{test.title}</h2>
                <strong>
                  {test.status === 'live'
                    ? pickLocale({ zh: '已上线', en: 'Live' }, locale)
                    : pickLocale({ zh: '筹备中', en: 'Coming Soon' }, locale)}
                </strong>
                <p>{test.teaser}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
