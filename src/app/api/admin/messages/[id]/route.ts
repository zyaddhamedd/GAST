import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

import { withAdminProtection } from '@/lib/require-admin';

export const PATCH = withAdminProtection(async (session, request, { params }) => {
  try {
    const { id } = await params;
    const messageId = parseInt(id, 10);
    
    if (isNaN(messageId)) {
      return new NextResponse('Invalid Message ID', { status: 400 });
    }

    const body = await request.json();
    const { readStatus } = body;

    if (readStatus === undefined) {
      return new NextResponse('readStatus is required', { status: 400 });
    }

    const message = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        readStatus: Boolean(readStatus),
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[ADMIN_MESSAGE_PATCH]', error);
    if ((error as any).code === 'P2025') {
      return new NextResponse('Message not found', { status: 404 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
});

