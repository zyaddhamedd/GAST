import { getRelatedProducts } from "@/lib/dal";
import { ProductCard } from "@/components/ProductCard";

interface RelatedProductsProps {
  categoryId: number;
  productId: number;
}

export async function RelatedProducts({ categoryId, productId }: RelatedProductsProps) {
  const related = await getRelatedProducts(categoryId, productId);

  if (related.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-blue relative inline-block">
          منتجات ذات صلة
          <div className="absolute -bottom-2 right-0 w-1/2 h-1.5 bg-[#ff6a00] rounded-full" />
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {related.map((prod: any) => (
          <ProductCard 
            key={prod.id} 
            product={{
              ...prod,
              rating: 4.5,
            } as any} 
          />
        ))}
      </div>
    </div>
  );
}
