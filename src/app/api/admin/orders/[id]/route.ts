import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { OrderStatus } from '@prisma/client';

import { withAdminProtection } from '@/lib/require-admin';

export const PATCH = withAdminProtection(async (session, request, { params }) => {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);
    
    if (isNaN(orderId)) {
      return new NextResponse('Invalid Order ID', { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return new NextResponse('Status is required', { status: 400 });
    }

    // Validate if status is strictly one of the valid enum values
    const validStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status as OrderStatus)) {
      return new NextResponse('Invalid status value. Allowed: PENDING, CONFIRMED, SHIPPED, DELIVERED', { status: 400 });
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status as OrderStatus,
      },
      include: {
        items: {
          include: {
            product: true,
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ADMIN_ORDER_PATCH]', error);
    if ((error as any).code === 'P2025') {
      return new NextResponse('Order not found', { status: 404 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
});

