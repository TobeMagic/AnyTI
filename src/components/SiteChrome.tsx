import { getPreferredLocale, pickLocale, withLocale } from '@/lib/locale';
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
  const locale = getPreferredLocale();
  const currentPath =
    typeof window === 'undefined'
      ? getHomeHref()
      : `${window.location.pathname}${window.location.hash}`;

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

  return (
    <header className="ref-chrome">
      <div className="ref-chrome__inner">
        <a className="ref-mark" href={withLocale(getHomeHref(), locale)}>
          <span className="ref-mark__icon" aria-hidden="true">
            <span className="ref-mark__dot" />
          </span>
          <span className="ref-mark__copy">
            <strong>LBTI</strong>
            <small>{pickLocale({ zh: '恋爱人格测试', en: 'Love Test' }, locale)}</small>
          </span>
        </a>

        <nav className="ref-nav" aria-label="Primary navigation">
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
          <div className="ref-lang">
            <a
              className={`ref-lang__link ${locale === 'zh' ? 'is-active' : ''}`}
              href={withLocale(currentPath, 'zh')}
            >
              中文
            </a>
            <a
              className={`ref-lang__link ${locale === 'en' ? 'is-active' : ''}`}
              href={withLocale(currentPath, 'en')}
            >
              EN
            </a>
          </div>
          <a className="ref-cta" href={withLocale(getStartTestHref(), locale)}>
            {pickLocale({ zh: '开始测试', en: 'Start Test' }, locale)}
          </a>
        </div>
      </div>
    </header>
  );
}
