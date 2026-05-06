import { getCategories, getShopProducts } from "@/lib/dal";
import { ShopClient } from "@/components/shop/ShopClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المتجر | GAST - طلمبات مياه بتكنولوجيا إيطالية",
  description: "تصفح مجموعة واسعة من طلمبات المياه والملحقات. حلول إيطالية موثوقة لجميع احتياجاتك.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  // STRICT PARAM READING
  const category = (resolvedParams.category as string) || null;
  const search = (resolvedParams.search as string) || undefined;
  const page = parseInt(resolvedParams.page as string || "1", 10);
  const power = resolvedParams.power ? (Array.isArray(resolvedParams.power) ? resolvedParams.power : [resolvedParams.power]) : [];
  const voltage = resolvedParams.voltage ? (Array.isArray(resolvedParams.voltage) ? resolvedParams.voltage : [resolvedParams.voltage]) : [];
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice as string, 10) : undefined;
  const inStock = resolvedParams.inStock === "true";

  const [categories, { products, totalCount }] = await Promise.all([
    getCategories(),
    getShopProducts({
      category,
      search,
      page,
      power: power.map(p => parseFloat(p)),
      voltage,
      maxPrice,
      itemsPerPage: 12
    })
  ]);

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <ShopClient 
      categories={categories}
      initialProducts={products}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
    />
  );
}
