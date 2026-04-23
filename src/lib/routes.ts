function normalizedBase() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

function normalizedPublicBase() {
  const base = normalizedBase();
  if (base !== '/') return base;

  const repoName = (import.meta.env.VITE_PUBLIC_REPO_NAME as string | undefined) || 'AnyTI';
  const cleaned = repoName.replace(/^\/+|\/+$/g, '');
  return cleaned ? `/${cleaned}/` : '/';
}

function trimLeadingSlash(path: string) {
  return path.replace(/^\/+/, '');
}

function publicOrigin() {
  const envOrigin = (import.meta.env.VITE_PUBLIC_SITE_ORIGIN as string | undefined)?.replace(/\/+$/g, '');
  if (envOrigin) return envOrigin;

  if (typeof window !== 'undefined' && /github\.io$/i.test(window.location.hostname)) {
    return window.location.origin;
  }

  return 'https://aimagician.github.io';
}

export function buildSiteHref(path = '') {
  return `${normalizedBase()}${trimLeadingSlash(path)}`;
}

export function buildPublicSiteHref(path = '') {
  return `${publicOrigin()}${normalizedPublicBase()}${trimLeadingSlash(path)}`;
}

export function getHomeHref() {
  return buildSiteHref();
}

export function getCategoryHref(slug: string) {
  if (slug === 'love') {
    return buildSiteHref('lbti/');
  }
  return buildSiteHref(`${slug}/`);
}

export function getTypesHref() {
  return buildSiteHref('types/');
}

export function getTypeDetailHref(slug: string) {
  return buildSiteHref(`types/${slug}/`);
}

export function getCrossAnalysisHref() {
  return buildSiteHref('lbti-mbti/');
}

export function getRankingsHref() {
  return buildSiteHref('rankings/');
}

export function getAboutHref() {
  return buildSiteHref('about/');
}

export function getStartTestHref() {
  return buildSiteHref('test/');
}

export function getTestHref(slug: string) {
  return buildSiteHref(`${slug}/`);
}

export function getCurrentHref() {
  if (typeof window === 'undefined') {
    return buildPublicSiteHref();
  }

  if (/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    const localPath = `${trimLeadingSlash(window.location.pathname)}${window.location.search}${window.location.hash}`;
    return buildPublicSiteHref(localPath);
  }

  return window.location.href;
}
