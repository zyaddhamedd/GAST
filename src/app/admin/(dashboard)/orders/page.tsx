import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import OrdersTable from '@/components/admin/OrdersTable';
import { AdminTableSkeleton } from '@/components/Skeletons';
import { normalizeImagePath } from '@/lib/utils';

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
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

  return orders.map((order: any) => ({
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      product: {
        ...item.product,
        images: item.product.images.map((img: any) => ({
          ...img,
          url: normalizeImagePath(img.url)
        }))
      }
    }))
  }));
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">الطلبات</h1>
        <p className="text-sm text-gray-500 mt-0.5">إدارة طلبات العملاء وحالات التوصيل</p>
      </div>

      <Suspense fallback={<AdminTableSkeleton />}>
        <OrdersTable initialOrders={orders} />
      </Suspense>
    </div>
  );
}
