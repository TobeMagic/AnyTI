import { SiteFooter } from '@/components/SiteFooter';
import { SiteChrome } from '@/components/SiteChrome';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getHomeHref, getTypesHref } from '@/lib/routes';

export function NotFoundPage() {
  const locale = getPreferredLocale();

  return (
    <div className="page-shell">
      <SiteChrome />
      <main className="page-shell__main">
        <section className="section-block section-block--narrow">
          <div className="cta-panel">
            <p className="eyebrow">404</p>
            <h1>{pickLocale({ zh: '这个入口暂时没接上', en: 'This entrance is not connected yet' }, locale)}</h1>
            <p>{pickLocale({ zh: '这个版本现在只保留了 LBTI 主站，先回测试页或者继续翻人格图鉴。', en: 'This version currently keeps the LBTI site live first. Go back or continue browsing the archive.' }, locale)}</p>
            <div className="result-actions">
              <a className="primary-button primary-button--link" href={getHomeHref()}>
                {pickLocale({ zh: '回到 LBTI', en: 'Back to LBTI' }, locale)}
              </a>
              <a className="ghost-button ghost-button--link" href={getTypesHref()}>
                {pickLocale({ zh: '去看图鉴', en: 'Browse Types' }, locale)}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
