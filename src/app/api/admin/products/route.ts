export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { slugify } from '@/lib/utils';
import { withAdminProtection } from '@/lib/require-admin';

export const POST = withAdminProtection(async (session, request) => {
  try {
    const body = await request.json();

    const name = body.name?.trim().normalize('NFC');
    const subtitle = body.subtitle?.trim().normalize('NFC');
    const description = body.description;
    const price = body.price;
    const oldPrice = body.oldPrice;
    const discount = body.discount;
    const inStock = body.inStock;
    const power = body.power;
    const voltage = body.voltage;
    const categoryId = parseInt(body.categoryId, 10);
    const images = body.images;
    const specs = body.specs;

    if (!name || !description || price === undefined || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const finalSlug = slugify(name);

    // SERVER-SIDE DOUBLE SUBMIT PROTECTION
    // If a product with the exact same name and category was created in the last 10 seconds, reject.
    const recentProduct = await prisma.product.findFirst({
      where: {
        name,
        categoryId,
        createdAt: {
          gt: new Date(Date.now() - 10000) // 10 seconds ago
        }
      }
    });

    if (recentProduct) {
      return NextResponse.json({ error: 'Duplicate submission detected. Please wait.' }, { status: 429 });
    }

    // SLUG COLLISION HANDLING (Strict)
    const existingSlug = await prisma.product.findUnique({
      where: { slug: finalSlug }
    });

    if (existingSlug) {
      return NextResponse.json({ error: 'A product with this name/slug already exists.' }, { status: 409 });
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
        categoryId: categoryId,
        images: {
          create: images?.map((img: { url: string }) => ({
            url: img.url,
          })) || [],
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    // @ts-ignore
    revalidateTag('products');
    // @ts-ignore
    revalidateTag(`product-slug-${product.slug.normalize('NFC')}`);
    // @ts-ignore
    revalidateTag('admin-stats');
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('[PRODUCTS_POST_ERROR]', {
      message: error.message,
      stack: error.stack,
      payload: error.meta
    });
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
});
