import { getShopProducts } from "@/lib/dal";
import { ShopClient, Category } from "@/components/shop/ShopClient";

interface ProductGridWrapperProps {
  searchParams: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    power?: string | string[];
    voltage?: string | string[];
    inStock?: string;
    page?: string;
  };
  categories: Category[];
}

export async function ProductGridWrapper({ searchParams, categories }: ProductGridWrapperProps) {
  const powerStrings = typeof searchParams.power === 'string' ? [searchParams.power] : searchParams.power;
  const power = powerStrings?.map(p => parseFloat(p.replace(" HP", ""))).filter(v => !isNaN(v));
  const voltage = typeof searchParams.voltage === 'string' ? [searchParams.voltage] : searchParams.voltage;
  const page = parseInt(searchParams.page || "1");
  const inStock = searchParams.inStock === "true";

  const data = await getShopProducts({
    category: searchParams.category,
    search: searchParams.search,
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined,
    power,
    voltage,
    inStock,
    page,
  });

  return (
    <ShopClient 
      categories={categories} 
      initialProducts={data.products as any} 
      totalCount={data.totalCount}
      totalPages={Math.ceil(data.totalCount / 8)}
      currentPage={page}
    />
  );
}
