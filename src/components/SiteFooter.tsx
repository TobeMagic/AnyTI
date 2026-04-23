import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getAboutHref, getHomeHref, getTypesHref } from '@/lib/routes';

type SiteFooterProps = {
  compact?: boolean;
};

export function SiteFooter({ compact = false }: SiteFooterProps) {
  const locale = getPreferredLocale();

  return (
    <footer className={`ref-footer ${compact ? 'ref-footer--compact' : ''}`}>
      <div className="ref-footer__inner">
        <a className="ref-footer__brand" href={getHomeHref()}>
          <strong>{pickLocale({ zh: 'LBTI 测试版', en: 'LBTI Beta' }, locale)}</strong>
          <small>{pickLocale({ zh: '恋爱人格测试', en: 'Love Personality Test' }, locale)}</small>
        </a>
        <div className="ref-footer__links">
          <a href={getTypesHref()}>{pickLocale({ zh: '人格图鉴', en: 'Types' }, locale)}</a>
          <a href={getAboutHref()}>{pickLocale({ zh: '关于', en: 'About' }, locale)}</a>
          <a href="#">{pickLocale({ zh: '使用条款', en: 'Terms' }, locale)}</a>
          <a href="#">{pickLocale({ zh: '隐私政策', en: 'Privacy' }, locale)}</a>
        </div>
      </div>
      <p className="ref-footer__disclaimer">
        {pickLocale(
          {
            zh: '本测试仅供娱乐，不适合作为严肃的心理诊断结果。请勿当真。',
            en: 'This test is for entertainment only and should not be treated as a clinical result.',
          },
          locale,
        )}
      </p>
      <p className="ref-footer__copyright">© 2026 LBTI. All rights reserved.</p>
    </footer>
  );
}
