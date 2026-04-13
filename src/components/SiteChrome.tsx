import { categories } from '@/lib/content';
import { getCategoryHref, getHomeHref, getTestHref } from '@/lib/routes';

type SiteChromeProps = {
  currentCategorySlug?: string;
};

export function SiteChrome({ currentCategorySlug }: SiteChromeProps) {
  return (
    <header className="site-chrome">
      <a className="site-mark" href={getHomeHref()}>
        <span className="site-mark__title">AnyTI</span>
        <span className="site-mark__tag">Type Matrix · Love First</span>
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
      <div className="site-chrome__actions">
        <a className="site-cta" href={getTestHref('lbti')}>
          先测恋爱
        </a>
      </div>
    </header>
  );
}
