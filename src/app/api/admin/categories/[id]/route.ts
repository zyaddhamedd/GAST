import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

import { withAdminProtection } from '@/lib/require-admin';

export const DELETE = withAdminProtection(async (session, request, { params }) => {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    
    if (isNaN(categoryId)) {
      return new NextResponse('Invalid Category ID', { status: 400 });
    }

    // Fetch category and its products to clean up Cloudinary images
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          include: { images: true }
        }
      }
    });

    if (category) {
      // Delete category image
      if (category.image.includes('res.cloudinary.com')) {
        await deleteFromCloudinary(category.image);
      }

      // Delete all images for products in this category
      for (const product of category.products) {
        for (const img of product.images) {
          if (img.url.includes('res.cloudinary.com')) {
            await deleteFromCloudinary(img.url);
          }
        }
      }
    }

    // Because of onDelete: Cascade in schema, deleting the category 
    // will automatically delete associated Products
    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    revalidateTag('categories', 'max');
    revalidateTag('products', 'max');
    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error('[ADMIN_CATEGORY_DELETE]', error);
    // Handle Prisma specific error for record not found
    if ((error as any).code === 'P2025') {
      return new NextResponse('Category not found', { status: 404 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
});

