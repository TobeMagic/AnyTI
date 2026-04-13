import { SiteChrome } from '@/components/SiteChrome';
import { getHomeHref, getTestHref } from '@/lib/routes';

export function NotFoundPage() {
  return (
    <div className="page-shell">
      <SiteChrome />
      <main className="page-shell__main">
        <section className="section-block section-block--narrow">
          <div className="cta-panel">
            <p className="eyebrow">404</p>
            <h1>这个入口暂时没接上</h1>
            <p>回首页重新选类别，或者直接进已经上线的 `WBTI` / `LBTI`。</p>
            <div className="result-actions">
              <a className="primary-button primary-button--link" href={getHomeHref()}>
                回到首页
              </a>
              <a className="ghost-button ghost-button--link" href={getTestHref('wbti')}>
                直接去 WBTI
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
