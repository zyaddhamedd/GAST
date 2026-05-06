export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withSiteContext } from '@/lib/site-detection';
import { revalidateTag } from 'next/cache';
import { slugify } from '@/lib/utils';

import { withAdminProtection } from '@/lib/require-admin';

export const POST = withAdminProtection(async (session, request) => {
  return withSiteContext(async () => {
    try {
      const body = await request.json();

      const {
        name,
        subtitle,
        description,
        price,
        oldPrice,
        discount,
        inStock,
        power,
        voltage,
        categoryId,
        images,
        specs,
      } = body;

      if (!name || !description || price === undefined || !categoryId) {
        return new NextResponse('Missing required fields', { status: 400 });
      }

      let finalSlug = slugify(name);
      
      const existingProduct = await prisma.product.findUnique({
        where: { slug: finalSlug }
      });
      
      if (existingProduct) {
        finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 5)}`;
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug: finalSlug,
          subtitle,
          description,
          price: parseFloat(price),
          oldPrice: oldPrice ? parseFloat(oldPrice) : null,
          discount: discount ? parseFloat(discount) : null,
          inStock: inStock !== undefined ? Boolean(inStock) : true,
          power: power ? parseFloat(power) : null,
          voltage,
          specs: specs && Array.isArray(specs) && specs.length > 0 ? specs : undefined,
          categoryId: parseInt(categoryId, 10),
          images: {
            create: images?.map((img: { url: string }) => ({
              url: img.url,
            })) || [],
          },
        } as any,
        include: {
          images: true,
          category: true,
        },
      });

      revalidateTag('products');
      revalidateTag(`product-slug-${encodeURIComponent(product.slug.normalize('NFC'))}`);
      revalidateTag('admin-stats');
      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      console.error('[PRODUCTS_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  });
});

