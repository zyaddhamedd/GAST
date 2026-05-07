export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { withAdminProtection } from '@/lib/require-admin';

export const POST = withAdminProtection(async (session, request) => {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    if (!name || !phone || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: { name, phone, email, message },
    });

    // @ts-ignore
    revalidateTag('admin-stats');
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});
