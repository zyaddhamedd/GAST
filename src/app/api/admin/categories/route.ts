export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { withAdminProtection } from '@/lib/require-admin';

export const POST = withAdminProtection(async (session, request) => {
  let name: string | undefined, slug: string | undefined, image: string | undefined;
  try {
    const body = await request.json();
    name = body.name?.trim().normalize('NFC');
    // If slug is provided, normalize it. If not, generate it from name.
    slug = (body.slug || body.name)?.trim().normalize('NFC');
    
    // Convert to URL-safe format if not already
    const { slugify } = require('@/lib/utils');
    if (slug) slug = slugify(slug);
    
    image = body.image;

    if (!name || !slug || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const payload = { name, slug, image };

    const category = await prisma.category.create({
      data: payload,
    });

    // @ts-ignore
    revalidateTag('categories');
    
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
      timestamp: new Date().toISOString()
    };
    
    console.error('[CATEGORIES_POST_ERROR]', {
      ...errorDetails,
      attemptedPayload: { name, slug, image }
    });
    
    
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
});
