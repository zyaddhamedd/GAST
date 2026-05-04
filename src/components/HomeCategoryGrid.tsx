import { getCategories } from "@/lib/dal";
import { CategoryGrid } from "@/components/CategoryGrid";

export async function HomeCategoryGrid() {
  const categories = await getCategories();
  return <CategoryGrid categories={categories} />;
}
