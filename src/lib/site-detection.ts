import { cache } from 'react';
import { headers, cookies } from 'next/headers';

export const detectSite = cache(async () => {
  const { prisma } = await import('./prisma');
  // Always return site with ID 1 (GAST) to force single-site mode
  return await prisma.site.findUnique({ where: { id: 1 } });
});

export async function withSiteContext<T>(fn: () => Promise<T>): Promise<T> {
  const { siteContext } = await import('./site-context');
  const site = await detectSite();
  
  if (!site) {
    throw new Error('Site not found');
  }

  return siteContext.run({ siteId: site.id, slug: site.slug }, fn);
}
