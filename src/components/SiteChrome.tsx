import { categories } from '@/lib/content';
import { getCategoryHref, getHomeHref } from '@/lib/routes';

type SiteChromeProps = {
  currentCategorySlug?: string;
};

export function SiteChrome({ currentCategorySlug }: SiteChromeProps) {
  return (
    <header className="site-chrome">
      <a className="site-mark" href={getHomeHref()}>
        <span className="site-mark__title">AnyTI</span>
        <span className="site-mark__tag">BTI Matrix Playground</span>
      </a>
      <nav className="site-nav" aria-label="Category navigation">
        {categories.map((category) => (
          <a
            key={category.id}
            className={`site-nav__link ${currentCategorySlug === category.slug ? 'is-active' : ''}`}
            href={getCategoryHref(category.slug)}
          >
            {category.title}
          </a>
        ))}
      </nav>
    </header>
  );
}
