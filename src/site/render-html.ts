import type { SitePage } from './page-manifest';

const defaultSocial = {
  description: '16 种恋爱角色、三面人格展示和可保存转发结果图。',
  image: 'https://tobemagic.github.io/AnyTI/logo.png',
  title: 'LBTI 恋爱人格测试｜AnyTI',
  url: 'https://tobemagic.github.io/AnyTI/',
};

type RenderSiteHtmlOptions = {
  assetBase: string;
  cssHrefs?: string[];
  scriptSrc: string;
};

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeBase(base: string) {
  return base.endsWith('/') ? base : `${base}/`;
}

function assetHref(base: string, path: string) {
  return `${normalizeBase(base)}${path.replace(/^\/+/, '')}`;
}

function renderAppAttrs(attrs: Record<string, string> | undefined) {
  if (!attrs) return '';

  return Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${escapeAttr(value)}"`)
    .join('');
}

export function renderSiteHtml(page: SitePage, options: RenderSiteHtmlOptions) {
  const cssLinks = (options.cssHrefs ?? [])
    .map((href) => `    <link rel="stylesheet" href="${escapeAttr(href)}" />`)
    .join('\n');
  const themeColor = page.themeColor
    ? `    <meta name="theme-color" content="${escapeAttr(page.themeColor)}" />\n`
    : '';

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeAttr(page.title)}</title>
    <meta name="description" content="${escapeAttr(page.description ?? defaultSocial.description)}" />
${themeColor}    <meta property="og:title" content="${escapeAttr(defaultSocial.title)}" />
    <meta property="og:description" content="${escapeAttr(defaultSocial.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeAttr(defaultSocial.url)}" />
    <meta property="og:image" content="${escapeAttr(defaultSocial.image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeAttr(defaultSocial.image)}" />
    <link rel="preload" href="${escapeAttr(assetHref(options.assetBase, 'logo-nav.webp'))}" as="image" type="image/webp" fetchpriority="high" />
    <link rel="icon" href="${escapeAttr(assetHref(options.assetBase, 'logo-180.png'))}" type="image/png" />
    <link rel="apple-touch-icon" href="${escapeAttr(assetHref(options.assetBase, 'logo-180.png'))}" />
${cssLinks ? `${cssLinks}\n` : ''}  </head>
  <body>
    <div id="app"${renderAppAttrs(page.appAttrs)}></div>
    <script type="module" src="${escapeAttr(options.scriptSrc)}"></script>
  </body>
</html>
`;
}
