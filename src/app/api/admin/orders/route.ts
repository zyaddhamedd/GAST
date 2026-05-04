export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { withAdminProtection } from '@/lib/require-admin';

export const GET = withAdminProtection(async (session, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const summary = searchParams.get('summary') === 'true';

    const orders = await prisma.order.findMany({
      take: limit,
      select: summary ? {
        id: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      } : {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        address: true,
        total: true,
        status: true,
        createdAt: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: { select: { url: true }, take: 1 }
              }
            },
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ADMIN_ORDERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});

