import { Suspense } from "react";
import { getCategories } from "@/lib/dal";
import { ProductGridWrapper } from "@/components/shop/ProductGridWrapper";
import { ProductGridSkeleton } from "@/components/Skeletons";


export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    category?: string; 
    search?: string; 
    minPrice?: string; 
    maxPrice?: string; 
    power?: string | string[]; 
    voltage?: string | string[];
    inStock?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  
  // Categories are relatively fast and needed for the filter UI
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* 
         Streaming the product grid while keeping the filter shell visible.
         This improves perceived performance and INP.
      */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 mt-8"><ProductGridSkeleton /></div>}>
        <ProductGridWrapper searchParams={sp} categories={categories} />
      </Suspense>
    </div>
  );
}
