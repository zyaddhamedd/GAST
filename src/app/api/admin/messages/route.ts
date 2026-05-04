import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

import { withAdminProtection } from '@/lib/require-admin';

export const GET = withAdminProtection(async () => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('[ADMIN_MESSAGES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});

