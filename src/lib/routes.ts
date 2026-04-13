function normalizedBase() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

function trimLeadingSlash(path: string) {
  return path.replace(/^\/+/, '');
}

export function buildSiteHref(path = '') {
  return `${normalizedBase()}${trimLeadingSlash(path)}`;
}

export function getHomeHref() {
  return buildSiteHref();
}

export function getCategoryHref(slug: string) {
  return buildSiteHref(`${slug}/`);
}

export function getTestHref(slug: string) {
  return buildSiteHref(`${slug}/`);
}

export function getCurrentHref() {
  if (typeof window === 'undefined') {
    return buildSiteHref();
  }

  return window.location.href;
}
