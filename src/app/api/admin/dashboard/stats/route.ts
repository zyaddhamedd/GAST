import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { withAdminProtection } from '@/lib/require-admin';

export const GET = withAdminProtection(async () => {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const [products, orders, messages, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.message.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        }
      })
    ]);

    return NextResponse.json({
      stats: { products, orders, messages },
      recentOrders
    });
  } catch (error) {
    console.error('[ADMIN_DASHBOARD_STATS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
});

