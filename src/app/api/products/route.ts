export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Product, ProductImage } from '@prisma/client';
import { normalizeImagePath } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const power = searchParams.get('power');

    // Build the query dynamically
    const where: any = {};

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (inStock !== null) {
      where.inStock = inStock === 'true';
    }

    if (power !== null) {
      const powerValue = parseFloat(power);
      if (!isNaN(powerValue)) {
        where.power = powerValue;
      }
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Normalize image paths before sending to client
    const normalizedProducts = products.map((product: Product & { images: ProductImage[] }) => {
      const images = product.images.map((img: ProductImage) => ({
        ...img,
        url: normalizeImagePath(img.url)
      }));
      
      return {
        ...product,
        images,
        // Provide the 'image' field expected by ProductCard
        image: images.length > 0 ? images[0].url : "/placeholder.webp"
      };
    });

    return NextResponse.json({
      products: normalizedProducts,
      totalCount,
      totalPages,
      currentPage: page
    });

  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
