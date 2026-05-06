export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withSiteContext } from '@/lib/site-detection';
import { revalidateTag } from 'next/cache';

import { withAdminProtection } from '@/lib/require-admin';

export const POST = withAdminProtection(async (session, request) => {
  return withSiteContext(async () => {
    try {
      const body = await request.json();
      const { name, slug, image } = body;

      if (!name || !slug || !image) {
        return new NextResponse('Missing required fields', { status: 400 });
      }

      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });

      if (existingCategory) {
        return new NextResponse('Slug already exists', { status: 409 });
      }

      // Casting to any to satisfy Prisma multi-tenant middleware requirements without manual siteId injection
      const category = await prisma.category.create({
        data: {
          name,
          slug,
          image,
        } as any,
      });

      revalidateTag('categories');
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.error('[CATEGORIES_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  });
});

