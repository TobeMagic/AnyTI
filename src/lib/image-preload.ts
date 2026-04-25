const preloadedImages = new Map<string, Promise<void>>();

type PreloadOptions = {
  fetchPriority?: 'high' | 'low' | 'auto';
};

function uniqueUrls(urls: Array<string | undefined>) {
  return Array.from(new Set(urls.filter((url): url is string => Boolean(url))));
}

export function preloadImage(url: string | undefined, options: PreloadOptions = {}) {
  if (!url || typeof window === 'undefined') {
    return Promise.resolve();
  }

  const cached = preloadedImages.get(url);
  if (cached) {
    return cached;
  }

  const promise = new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.fetchPriority = options.fetchPriority ?? 'auto';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;

    void image.decode?.().then(() => resolve()).catch(() => resolve());
  });

  preloadedImages.set(url, promise);
  return promise;
}

export function addImagePreloadLinks(urls: Array<string | undefined>, options: PreloadOptions = {}) {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const links = uniqueUrls(urls).map((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = options.fetchPriority ?? 'auto';
    document.head.appendChild(link);
    return link;
  });

  return () => {
    links.forEach((link) => link.remove());
  };
}

export function scheduleImagePreload(urls: Array<string | undefined>, options: PreloadOptions = {}) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const pendingUrls = uniqueUrls(urls);
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  const run = () => {
    pendingUrls.forEach((url) => {
      void preloadImage(url, options);
    });
  };

  if (typeof idleWindow.requestIdleCallback === 'function') {
    const idleId = idleWindow.requestIdleCallback(run, { timeout: 1200 });
    return () => idleWindow.cancelIdleCallback?.(idleId);
  }

  const timer = window.setTimeout(run, 120);
  return () => window.clearTimeout(timer);
}
