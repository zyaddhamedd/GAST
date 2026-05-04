import { cache } from 'react';
import { headers, cookies } from 'next/headers';

export const detectSite = cache(async () => {
  const { prisma } = await import('./prisma');
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  const cookieStore = await cookies();
  const activeSiteSlug = cookieStore.get('active_site_slug')?.value;

  if (activeSiteSlug) {
    const site = await prisma.site.findUnique({
      where: { slug: activeSiteSlug },
    });
    if (site) {
      return site;
    }
  }

  const domain = host.split(':')[0];
  const site = await prisma.site.findFirst({
    where: {
      OR: [
        { domain: domain },
        { slug: domain.split('.')[0] }
      ]
    }
  });

  if (site) {
    return site;
  }

  const defaultSite = await prisma.site.findFirst({ where: { slug: 'gast' } });
  return defaultSite;
});

export async function withSiteContext<T>(fn: () => Promise<T>): Promise<T> {
  const { siteContext } = await import('./site-context');
  const site = await detectSite();
  
  if (!site) {
    throw new Error('Site not found');
  }

  return siteContext.run({ siteId: site.id, slug: site.slug }, fn);
}
