export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withSiteContext } from '@/lib/site-detection';
import { revalidateTag } from 'next/cache';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export async function POST(request: Request) {
  return withSiteContext(async () => {
    try {
      const body = await request.json();
      const { 
        customerName, 
        phone, 
        email, 
        address, 
        items,
        paymentProofImage
      } = body;

      const rawMethod = body.paymentMethod || PaymentMethod.COD;

      if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
        return new NextResponse('Missing required fields', { status: 400 });
      }

      if (!Object.values(PaymentMethod).includes(rawMethod)) {
        return new NextResponse('طريقة دفع غير مدعومة', { status: 400 });
      }

      const paymentMethod = rawMethod as PaymentMethod;

      if (paymentMethod === PaymentMethod.INSTAPAY && (!paymentProofImage || !paymentProofImage.trim())) {
        return new NextResponse('إيصال الدفع (سكرين شوت) مطلوب لطلبات انستاباي', { status: 400 });
      }

      const orderStatus = paymentMethod === PaymentMethod.INSTAPAY ? OrderStatus.PENDING_VERIFICATION : OrderStatus.PENDING;
      const sanitizedProofImage = paymentMethod === 'INSTAPAY' ? paymentProofImage.trim() : null;

      const productIds = items.map((item: any) => parseInt(item.productId, 10));
      
      if (productIds.some(isNaN)) {
        return new NextResponse('Invalid Product ID found', { status: 400 });
      }

      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });

      if (dbProducts.length !== productIds.length) {
        return new NextResponse('Product not found', { status: 400 });
      }

      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items as any[]) {
        const product = dbProducts.find((p: any) => p.id === parseInt(item.productId, 10));
        if (!product) return new NextResponse(`Product ID ${item.productId} not found`, { status: 400 });
        if (!product.inStock) return new NextResponse(`Product ${product.name} is out of stock`, { status: 400 });

        const quantity = parseInt(item.quantity, 10);
        if (isNaN(quantity) || quantity <= 0) return new NextResponse(`Invalid quantity for ${product.name}`, { status: 400 });

        calculatedTotal += product.price * quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: quantity,
          price: product.price,
        });
      }

      const order = await prisma.order.create({
        data: {
          customerName,
          phone,
          email,
          address,
          total: calculatedTotal,
          status: orderStatus,
          paymentMethod: paymentMethod,
          paymentProofImage: sanitizedProofImage,
          items: {
            create: orderItemsData,
          }
        } as any,
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
        }
      });

      revalidateTag('admin-stats', 'max');

      return NextResponse.json(order, { status: 201 });
    } catch (error) {
      console.error('[ORDERS_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  });
}
