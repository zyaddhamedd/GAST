export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { normalizeImagePath } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Normalize image paths before sending to client
    const normalizedCategories = categories.map((cat: Category) => ({
      ...cat,
      image: normalizeImagePath(cat.image)
    }));

    return NextResponse.json(normalizedCategories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
