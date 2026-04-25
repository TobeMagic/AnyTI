import { SiteFooter } from '@/components/SiteFooter';
import { SiteChrome } from '@/components/SiteChrome';
import { getHomeHref, getTypesHref } from '@/lib/routes';

export function NotFoundPage() {
  return (
    <div className="page-shell">
      <SiteChrome />
      <main className="page-shell__main">
        <section className="section-block section-block--narrow">
          <div className="cta-panel">
            <p className="eyebrow">404</p>
            <h1>这个入口暂时没接上</h1>
            <p>这个版本现在只保留了 LBTI 主站，先回测试页或者继续翻人格图鉴。</p>
            <div className="result-actions">
              <a className="primary-button primary-button--link" href={getHomeHref()}>
                回到 LBTI
              </a>
              <a className="ghost-button ghost-button--link" href={getTypesHref()}>
                去看图鉴
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
