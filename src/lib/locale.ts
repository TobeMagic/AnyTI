export type Locale = 'zh' | 'en';

const STORAGE_KEY = 'anyti:locale';

function normalizeDefaultLocaleUrl() {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  if (url.searchParams.get('lang') !== 'zh') {
    return;
  }

  url.searchParams.delete('lang');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function getPreferredLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'zh';
  }

  const search = new URLSearchParams(window.location.search);
  const fromQuery = search.get('lang');
  if (fromQuery === 'zh' || fromQuery === 'en') {
    window.localStorage.setItem(STORAGE_KEY, fromQuery);
    if (fromQuery === 'zh') {
      normalizeDefaultLocaleUrl();
    }
    return fromQuery;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'zh';
}

export function withLocale(href: string, locale: Locale) {
  if (typeof window === 'undefined') {
    const [pathWithQuery, hash = ''] = href.split('#');
    const url = new URL(pathWithQuery, 'https://lbti.local');
    if (locale === 'en') {
      url.searchParams.set('lang', 'en');
    } else {
      url.searchParams.delete('lang');
    }
    return `${url.pathname}${url.search}${hash ? `#${hash}` : ''}`;
  }

  const url = new URL(href, window.location.origin);
  if (locale === 'en') {
    url.searchParams.set('lang', 'en');
  } else {
    url.searchParams.delete('lang');
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function pickLocale<T>(value: Record<Locale, T>, locale: Locale) {
  return value[locale];
}
