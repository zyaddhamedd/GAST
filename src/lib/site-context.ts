import { AsyncLocalStorage } from 'async_hooks';

export const siteContext = new AsyncLocalStorage<{ siteId: number; slug: string }>();

export function getSiteId() {
  const store = siteContext.getStore();
  return store?.siteId;
}

export function getSiteSlug() {
  const store = siteContext.getStore();
  return store?.slug;
}
