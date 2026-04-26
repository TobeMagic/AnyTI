import type { Plugin } from 'vite';
import { sitePages, type SitePage } from './page-manifest';
import { renderSiteHtml } from './render-html';

type ViteChunkWithMetadata = {
  fileName: string;
  isEntry: boolean;
  name: string;
  type: 'chunk';
  viteMetadata?: {
    importedAssets?: Set<string>;
    importedCss?: Set<string>;
  };
};

function normalizeBase(base: string) {
  return base.endsWith('/') ? base : `${base}/`;
}

function publicHref(base: string, fileName: string) {
  return `${normalizeBase(base)}${fileName.replace(/^\/+/, '')}`;
}

function stripBase(pathname: string, base: string) {
  const normalized = normalizeBase(base);
  if (normalized !== '/' && pathname.startsWith(normalized)) {
    return pathname.slice(normalized.length - 1);
  }
  return pathname;
}

function pathnameToFileName(pathname: string, base: string) {
  let cleanPath = decodeURIComponent(stripBase(pathname, base)).split('?')[0]?.split('#')[0] ?? '/';
  if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;

  if (cleanPath === '/' || cleanPath === '') return 'index.html';
  const trimmed = cleanPath.replace(/^\/+/, '');
  if (trimmed.endsWith('.html')) return trimmed;
  return `${trimmed.replace(/\/+$/, '')}/index.html`;
}

function findPageForRequest(pathname: string, base: string) {
  const fileName = pathnameToFileName(pathname, base);
  return sitePages.find((page) => page.fileName === fileName);
}

function isHtmlNavigation(req: { headers: { accept?: string }; method?: string; url?: string }) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') return false;
  const url = req.url ?? '';
  if (url.includes('/@vite') || url.includes('/src/') || url.includes('/node_modules/')) return false;
  if (/\.[a-z0-9]+($|\?)/i.test(url) && !/\.html($|\?)/i.test(url)) return false;

  return (req.headers.accept ?? '').includes('text/html') || url === '/' || url.endsWith('/');
}

function findEntryChunk(bundle: Record<string, unknown>, entryKey: string) {
  return Object.values(bundle).find((item): item is ViteChunkWithMetadata => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<ViteChunkWithMetadata>;
    return candidate.type === 'chunk' && candidate.isEntry === true && candidate.name === entryKey;
  });
}

function getCssHrefs(chunk: ViteChunkWithMetadata, bundle: Record<string, unknown>, base: string) {
  const importedCss = [...(chunk.viteMetadata?.importedCss ?? [])];
  const fallbackCss = Object.values(bundle)
    .filter((item): item is { fileName: string; type: 'asset' } => {
      if (!item || typeof item !== 'object') return false;
      const candidate = item as { fileName?: string; type?: string };
      return candidate.type === 'asset' && Boolean(candidate.fileName?.endsWith('.css'));
    })
    .map((item) => item.fileName);

  return [...new Set(importedCss.length > 0 ? importedCss : fallbackCss)].map((fileName) =>
    publicHref(base, fileName),
  );
}

export function siteHtmlPlugin(base: string): Plugin {
  return {
    name: 'anyti-site-html',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!isHtmlNavigation(req)) {
          next();
          return;
        }

        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
        const page = findPageForRequest(pathname, server.config.base) ?? sitePages.find((item) => item.fileName === '404.html');
        if (!page) {
          next();
          return;
        }

        const html = renderSiteHtml(page, {
          assetBase: server.config.base,
          scriptSrc: publicHref(server.config.base, page.entryKey === 'home' ? 'src/entries/home.tsx' : `src/entries/${entryToFileName(page)}.tsx`),
        });
        const transformed = await server.transformIndexHtml(req.url ?? '/', html);

        res.statusCode = page.fileName === '404.html' ? 404 : 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(transformed);
      });
    },
    generateBundle(_, bundle) {
      for (const page of sitePages) {
        const chunk = findEntryChunk(bundle, page.entryKey);
        if (!chunk) {
          this.error(`Missing entry chunk for ${page.entryKey}`);
          continue;
        }

        this.emitFile({
          fileName: page.fileName,
          source: renderSiteHtml(page, {
            assetBase: base,
            cssHrefs: getCssHrefs(chunk, bundle as Record<string, unknown>, base),
            scriptSrc: publicHref(base, chunk.fileName),
          }),
          type: 'asset',
        });
      }
    },
  };
}

function entryToFileName(page: SitePage) {
  switch (page.entryKey) {
    case 'lbtiMbti':
      return 'cross-analysis';
    case 'lbti':
      return 'test';
    case 'notFound':
      return 'not-found';
    case 'startTest':
      return 'start-test';
    case 'typeDetail':
      return 'type-detail';
    default:
      return page.entryKey;
  }
}
