"use client";

import { useOptimistic, useTransition, memo, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { normalizeImagePath } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";


interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  inStock: boolean;
  category?: { name: string };
  images?: { url: string }[];
}

/**
 * Optimized Product Card for Mobile
 */
const ProductCard = memo(({ 
  product, 
  onDelete, 
  isPending 
}: { 
  product: Product; 
  onDelete: (id: number) => void; 
  isPending: boolean;
}) => {
  return (
    <div className="bg-[#111111] rounded-2xl border border-white/5 p-4 flex flex-col gap-4 shadow-sm active:scale-[0.98] transition-all">
      <div className="flex gap-4">
        <div className="relative w-16 h-16 rounded-xl bg-white/5 border border-white/5 overflow-hidden shrink-0">
          {product.images?.[0] ? (
            <SafeImage 
              src={normalizeImagePath(product.images[0].url)} 
              alt="" 
              fill
              className="object-cover" 
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <img src="/placeholder.webp" alt="" className="w-1/2 h-1/2 object-contain opacity-20" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-bold text-white truncate">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category?.name}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="font-black text-red-500">${product.price.toFixed(2)}</span>
             <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-white/5">
        <Link 
          href={`/admin/products/${product.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-blue-500/10 text-gray-400 hover:text-blue-500 rounded-xl border border-white/5 transition-all text-xs font-bold"
        >
          <Edit size={16} />
          Edit
        </Link>
        <button 
          onClick={() => onDelete(product.id)}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl border border-white/5 transition-all text-xs font-bold disabled:opacity-50"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

/**
 * Optimized Product Row Component
 * Wrapped in React.memo to prevent re-renders when other rows change.
 */
const ProductRow = memo(({ 
  product, 
  onDelete, 
  isPending 
}: { 
  product: Product; 
  onDelete: (id: number) => void; 
  isPending: boolean;
}) => {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/5 overflow-hidden shrink-0">
            {product.images?.[0] ? (
              <SafeImage 
                src={normalizeImagePath(product.images[0].url)} 
                alt="" 
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                sizes="40px"
              />

            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <img src="/placeholder.webp" alt="" className="w-1/2 h-1/2 object-contain opacity-20" />
              </div>
            )}
          </div>
          <span className="font-medium text-white truncate max-w-[200px]">{product.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{product.category?.name}</td>
      <td className="px-6 py-4 font-bold text-white">${product.price.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-150">
          <Link 
            href={`/admin/products/${product.id}`}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all active:scale-90"
          >
            <Edit size={18} />
          </Link>
          <button 
            onClick={() => onDelete(product.id)}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-90 disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});


ProductRow.displayName = "ProductRow";

export default function ProductsTable({ 
  initialProducts, 
  totalPages, 
  currentPage 
}: { 
  initialProducts: Product[]; 
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [optimisticProducts, deleteOptimistic] = useOptimistic(
    initialProducts,
    (state, productId: number) => state.filter(p => p.id !== productId)
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`/admin/products?${params.toString()}`);
  };


  // Stable callback to prevent ProductRow re-renders
  const handleDelete = useCallback((id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    startTransition(async () => {
      deleteOptimistic(id);
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        router.refresh();
      } catch {
        alert('Failed to delete product');
        router.refresh();
      }
    });
  }, [deleteOptimistic, router]);

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {optimisticProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onDelete={handleDelete} 
            isPending={isPending} 
          />
        ))}
        {optimisticProducts.length === 0 && (
          <div className="bg-[#111111] rounded-2xl border border-white/5 p-12 text-center text-gray-600 font-medium">
            No products available.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {optimisticProducts.map((product) => (
                <ProductRow 
                  key={product.id} 
                  product={product} 
                  onDelete={handleDelete} 
                  isPending={isPending} 
                />
              ))}
              {optimisticProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-600 font-medium">No products available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Admin Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>

  );
}
