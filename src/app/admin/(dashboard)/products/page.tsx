import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductsTable from '@/components/admin/ProductsTable';
import { AdminTableSkeleton } from '@/components/Skeletons';
import { normalizeImagePath } from '@/lib/utils';

async function getProducts(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      include: {
        category: { select: { name: true } },
        images: { select: { url: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);

  return {
    products: products.map((product: any) => ({
      ...product,
      images: product.images.map((img: any) => ({
        ...img,
        url: normalizeImagePath(img.url)
      }))
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 10;
  const { products, totalCount, totalPages } = await getProducts(page, limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">المنتجات</h1>
          <p className="text-sm text-gray-500 mt-0.5">إدارة المخزون والأسعار والمواصفات ({totalCount} منتج)</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-red-600/20"
        >
          <Plus size={18} />
          إضافة منتج
        </Link>
      </div>

      <Suspense fallback={<AdminTableSkeleton />}>
        <ProductsTable 
          initialProducts={products} 
          totalPages={totalPages} 
          currentPage={page} 
        />
      </Suspense>
    </div>
  );
}

