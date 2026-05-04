export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withSiteContext } from '@/lib/site-detection';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  return withSiteContext(async () => {
    try {
      const body = await request.json();
      const { name, phone, email, message } = body;

      if (!name || !phone || !message) {
        return new NextResponse('Missing required fields', { status: 400 });
      }

      const newMessage = await prisma.message.create({
        data: {
          name,
          phone,
          email,
          message,
        } as any,
      });

      revalidateTag('admin-stats', 'max');

      return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
      console.error('[MESSAGES_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  });
}
