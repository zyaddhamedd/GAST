import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { slugify } from '@/lib/utils';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

import { withAdminProtection } from '@/lib/require-admin';

export const PATCH = withAdminProtection(async (session, request, { params }) => {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return new NextResponse('Invalid Product ID', { status: 400 });
    }

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
      specs,
      images, // { url: string }[] - if provided, completely replaces existing images
    } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) {
      dataToUpdate.name = name;
      dataToUpdate.slug = slugify(name);
    }
    if (subtitle !== undefined) dataToUpdate.subtitle = subtitle;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (oldPrice !== undefined) dataToUpdate.oldPrice = oldPrice ? parseFloat(oldPrice) : null;
    if (discount !== undefined) dataToUpdate.discount = discount ? parseFloat(discount) : null;
    if (inStock !== undefined) dataToUpdate.inStock = Boolean(inStock);
    if (power !== undefined) dataToUpdate.power = power ? parseFloat(power) : null;
    if (voltage !== undefined) dataToUpdate.voltage = voltage;
    if (categoryId !== undefined) dataToUpdate.categoryId = parseInt(categoryId, 10);
    if (specs !== undefined) dataToUpdate.specs = specs;

    // Handle Images update
    if (images && Array.isArray(images)) {
      // Fetch old images to delete from Cloudinary
      const oldProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true }
      });
      
      if (oldProduct) {
        for (const img of oldProduct.images) {
          if (img.url.includes('res.cloudinary.com')) {
            await deleteFromCloudinary(img.url);
          }
        }
      }

      // Delete existing images and create new ones
      dataToUpdate.images = {
        deleteMany: {},
        create: images.map((img: { url: string }) => ({
          url: img.url,
        })),
      };
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: dataToUpdate,
      include: {
        images: true,
        category: true,
      },
    });

    const { revalidatePath } = await import('next/cache');
    revalidateTag('products', 'page');
    revalidateTag(`product-slug-${product.slug}`, 'page');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/shop');
    return NextResponse.json(product);
  } catch (error) {
    console.error('[ADMIN_PRODUCT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});

export const DELETE = withAdminProtection(async (session, request, { params }) => {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return new NextResponse('Invalid Product ID', { status: 400 });
    }

    // Fetch images first to delete them from Cloudinary
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }
    });

    if (product) {
      // Delete images from Cloudinary
      for (const img of product.images) {
        if (img.url.includes('res.cloudinary.com')) {
          await deleteFromCloudinary(img.url);
        }
      }
    }

    // Because of onDelete: Cascade in schema, deleting the product 
    // will automatically delete associated ProductImages and OrderItems
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    const { revalidatePath } = await import('next/cache');
    revalidateTag('products', 'page');
    revalidateTag(`product-slug-${product.slug}`, 'page');
    revalidateTag('admin-stats', 'page');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/shop');
    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error('[ADMIN_PRODUCT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});

