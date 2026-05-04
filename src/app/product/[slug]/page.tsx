import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/dal";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RelatedProductsSkeleton } from "@/components/Skeletons";
import {
  Star, Truck, ShieldCheck, Award, Zap, Activity
} from "lucide-react";

export const revalidate = 60;

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Critical data: needed to render the main product UI
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = product.images?.length > 0
    ? product.images
    : ["/placeholder.webp"];

  // Build specs
  const dbSpecs: { key: string; value: string }[] = Array.isArray(product.specs)
    ? (product.specs as { key: string; value: string }[])
    : [];

  const fallbackSpecs: { key: string; value: string }[] = [
    ...(product.power ? [{ key: 'القدرة (HP)', value: `${product.power} حصان` }] : []),
    ...(product.voltage ? [{ key: 'الجهد (Voltage)', value: product.voltage }] : []),
    ...(product.category?.name ? [{ key: 'الفئة', value: product.category.name }] : []),
  ];

  const allSpecs = dbSpecs.length > 0 ? dbSpecs : fallbackSpecs;

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ff6a00] transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#ff6a00] transition-colors">المتجر</Link>
            <span>/</span>
            <span className="text-brand-blue font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-12">
          {/* Main Product Section */}
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Image Gallery (Client Island) */}
            <ProductGallery 
              images={images} 
              productName={product.name} 
              discount={product.discount ?? undefined} 
              inStock={product.inStock} 
            />

            {/* Product Info */}
            <div className="w-full lg:w-1/2 flex flex-col">
              {/* Header */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-3 leading-tight">
                  {product.name}
                </h1>
                {product.subtitle && (
                  <p className="text-gray-500 text-lg mb-4">{product.subtitle}</p>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "fill-[#ffc107] text-[#ffc107]" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-4">
                  <span className="text-4xl font-black text-[#ff6a00]">
                    {product.price.toLocaleString("ar-EG")}{" "}
                    <span className="text-lg font-bold text-gray-500">ج.م</span>
                  </span>
                  {product.oldPrice && (
                    <span className="text-xl text-gray-400 line-through mb-1 font-medium">
                      {product.oldPrice.toLocaleString("ar-EG")} ج.م
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">الأسعار تشمل ضريبة القيمة المضافة</p>
              </div>

              {/* Quick Specs - Modern Highlights */}
              {(product.power || product.voltage) && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {product.power && (
                    <div className="flex-1 min-w-[150px] bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 group">
                      <div className="w-11 h-11 bg-orange-50 text-[#ff6a00] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">القدرة</span>
                        <span className="text-sm font-black text-brand-blue">{product.power} حصان</span>
                      </div>
                    </div>
                  )}
                  {product.voltage && (
                    <div className="flex-1 min-w-[150px] bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 group">
                      <div className="w-11 h-11 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">الجهد</span>
                        <span className="text-sm font-black text-brand-blue">{product.voltage}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description Preview */}
              {product.description && (
                <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-brand-blue mb-3 text-lg">وصف المنتج:</h3>
                  <p className="text-gray-700 font-medium leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>
              )}

              {/* CTA (Client Island) */}
              <ProductActions 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: images[0],
                  inStock: product.inStock
                }} 
              />

              {/* Trust Elements */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 mt-auto">
                <div className="flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-600">شحن سريع</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-600">دفع آمن</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-12 h-12 bg-orange-50 text-[#ff6a00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-600">ضمان معتمد</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs (Client Island) */}
        <ProductTabs description={product.description} specs={allSpecs} />

        {/* Non-critical: Related Products (Streamed) */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts categoryId={product.categoryId} productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
