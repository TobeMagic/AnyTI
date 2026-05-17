import { useState } from 'react';
import { getPreferredLocale, pickLocale, setPreferredLocale, withLocale } from '@/lib/locale';
import {
  getAboutHref,
  getCrossAnalysisHref,
  getHomeHref,
  getRankingsHref,
  getStartTestHref,
  getTypesHref,
} from '@/lib/routes';

type SiteChromeProps = {
  current?: 'home' | 'types' | 'analysis' | 'rankings' | 'about' | 'test';
};

export function SiteChrome({ current = 'home' }: SiteChromeProps) {
  const [navOpen, setNavOpen] = useState(false);
  const locale = getPreferredLocale();
  const currentPath =
    typeof window === 'undefined'
      ? getHomeHref()
      : `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const navItems = [
    {
      key: 'types',
      href: withLocale(getTypesHref(), locale),
      label: pickLocale({ zh: '人格类型', en: 'Types' }, locale),
    },
    {
      key: 'analysis',
      href: withLocale(getCrossAnalysisHref(), locale),
      label: pickLocale({ zh: '交叉解析', en: 'Cross Analysis' }, locale),
    },
    {
      key: 'rankings',
      href: withLocale(getRankingsHref(), locale),
      label: pickLocale({ zh: '排行榜', en: 'Rankings' }, locale),
    },
    {
      key: 'about',
      href: withLocale(getAboutHref(), locale),
      label: pickLocale({ zh: '关于测试', en: 'About' }, locale),
    },
  ];

  const navId = 'site-primary-navigation';
  const logoHref = `${import.meta.env.BASE_URL}logo-nav.webp`;

  return (
    <header className={`ref-chrome ${navOpen ? 'ref-chrome--open' : ''}`}>
      <div className="ref-chrome__inner">
        <a className="ref-mark" href={withLocale(getHomeHref(), locale)}>
          <span className="ref-mark__icon" aria-hidden="true">
            <img
              className="ref-mark__logo"
              src={logoHref}
              alt=""
              width="44"
              height="44"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </span>
          <span className="ref-mark__copy">
            <strong>LBTI</strong>
            <small>{pickLocale({ zh: '恋爱人格测试', en: 'Love Test' }, locale)}</small>
          </span>
        </a>

        <nav className="ref-nav" id={navId} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={`ref-nav__link ${current === item.key ? 'is-active' : ''}`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ref-chrome__actions">
          <button
            aria-controls={navId}
            aria-expanded={navOpen}
            aria-label={pickLocale({ zh: navOpen ? '收起导航' : '展开导航', en: navOpen ? 'Close navigation' : 'Open navigation' }, locale)}
            className="ref-menu-toggle"
            onClick={() => setNavOpen((open) => !open)}
            type="button"
          >
            <span className="ref-menu-toggle__chevron" aria-hidden="true" />
          </button>
          <div className="ref-lang">
            <a
              className={`ref-lang__link ${locale === 'zh' ? 'is-active' : ''}`}
              href={withLocale(currentPath, 'zh')}
              onClick={() => setPreferredLocale('zh')}
            >
              中文
            </a>
            <a
              className={`ref-lang__link ${locale === 'en' ? 'is-active' : ''}`}
              href={withLocale(currentPath, 'en')}
              onClick={() => setPreferredLocale('en')}
            >
              EN
            </a>
          </div>
          <a
            className="ref-gh-link"
            href="https://github.com/TobeMagic/AnyTI"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </a>
          <a className="ref-cta" href={withLocale(getStartTestHref(), locale)}>
            {pickLocale({ zh: '开始测试', en: 'Start Test' }, locale)}
          </a>
        </div>
      </div>
    </header>
  );
}
