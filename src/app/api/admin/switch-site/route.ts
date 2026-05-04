import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { withAdminProtection } from '@/lib/require-admin';

export const POST = withAdminProtection(async (session, request) => {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return new NextResponse('Slug is required', { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set('active_site_slug', slug, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SWITCH_SITE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});

