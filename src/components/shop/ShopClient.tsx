"use client";

import { useState, useEffect, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { normalizeImagePath } from "@/lib/utils";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  subtitle?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  power?: string;
  voltage?: string;
  inStock: boolean;
  category: string;
}

interface ShopClientProps {
  categories: Category[];
  initialProducts: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const powerOptions = ["1 HP", "1.5 HP", "2 HP", "3 HP", "5 HP", "7.5 HP"];
const voltageOptions = ["220V", "380V"];

export function ShopClient({ 
  categories, 
  initialProducts, 
  totalCount, 
  totalPages, 
  currentPage 
}: ShopClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const productsRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedPower, setSelectedPower] = useState<string[]>(searchParams.getAll("power") || []);
  const [selectedVoltage, setSelectedVoltage] = useState<string[]>(searchParams.getAll("voltage") || []);
  const [priceRange, setPriceRange] = useState<number>(parseInt(searchParams.get("maxPrice") || "20000"));
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const selectedCategorySlug = searchParams.get("category") || "all";
  const selectedCategoryName = categories.find(c => c.slug === selectedCategorySlug)?.name || "all";

  // Debounced update for filters
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery) params.set("search", searchQuery);
      else params.delete("search");

      params.delete("power");
      selectedPower.forEach(p => params.append("power", p));

      params.delete("voltage");
      selectedVoltage.forEach(v => params.append("voltage", v));

      if (priceRange < 20000) params.set("maxPrice", priceRange.toString());
      else params.delete("maxPrice");

      if (inStockOnly) params.set("inStock", "true");
      else params.delete("inStock");

      // Reset page when filters change
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedPower, selectedVoltage, priceRange, inStockOnly, pathname, router, searchParams]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const togglePower = (p: string) =>
    setSelectedPower((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const toggleVoltage = (v: string) =>
    setSelectedVoltage((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPower([]);
    setSelectedVoltage([]);
    setPriceRange(20000);
    setInStockOnly(false);
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24" dir="rtl">
      {/* Categories Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 mb-8 md:mb-10">
        <div className="bg-white p-2 md:p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-2 md:px-0">
            <h2 className="text-lg md:text-xl font-bold text-brand-blue">تصفح بالفئة</h2>
            {selectedCategorySlug !== "all" && (
              <button
                onClick={() => handleCategoryChange("all")}
                className="text-xs md:text-sm text-[#ff6a00] hover:underline font-medium"
              >
                عرض الكل
              </button>
            )}
          </div>

          <div className="flex lg:grid lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex-shrink-0 w-24 md:w-auto group relative rounded-xl overflow-hidden aspect-[1/1] md:aspect-[4/3] flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                  selectedCategorySlug === cat.slug
                    ? "border-[#ff6a00] bg-[#fff7ed] shadow-md ring-2 ring-[#ff6a00]/10"
                    : "border-transparent bg-gray-50 hover:bg-gray-100 hover:shadow"
                }`}
              >
                <div className="absolute inset-0 p-2 md:p-4">
                  <SafeImage
                    src={normalizeImagePath(cat.image)}
                    alt={cat.name}
                    fill
                    className={`object-contain p-1 md:p-2 group-hover:scale-110 transition-transform duration-500 ${
                      selectedCategorySlug === cat.slug ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                    }`}
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                </div>
                <div
                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t pt-4 pb-1 md:pb-2 px-1 text-center transition-colors duration-300 ${
                    selectedCategorySlug === cat.slug
                      ? "from-[#fff7ed] via-[#fff7ed]/90"
                      : "from-white via-white/80"
                  } to-transparent`}
                >
                  <span
                    className={`text-[10px] md:text-sm font-bold transition-colors leading-tight ${
                      selectedCategorySlug === cat.slug
                        ? "text-[#ff6a00]"
                        : "text-brand-blue group-hover:text-[#ff6a00]"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={productsRef}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="font-bold text-brand-blue">
              {totalCount} منتج
            </span>
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 text-brand-blue font-medium bg-gray-50 px-4 py-2 rounded-lg"
            >
              <SlidersHorizontal className="w-5 h-5" />
              فلاتر
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`w-full lg:w-1/4 space-y-6 lg:block ${isMobileFilterOpen ? "block" : "hidden"}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-brand-blue flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  تصنيف المنتجات
                </h3>
                {(searchQuery || selectedPower.length > 0 || selectedVoltage.length > 0 || priceRange < 20000 || inStockOnly) && (
                  <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    مسح الكل
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] transition-colors"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded overflow-hidden group-hover:border-[#ff6a00] transition-colors bg-white mr-0 ml-3">
                    <input
                      type="checkbox"
                      className="absolute opacity-0 cursor-pointer"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    {inStockOnly && (
                      <div className="absolute inset-0 bg-[#ff6a00] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-blue transition-colors">
                    متوفر في المخزون فقط
                  </span>
                </label>
              </div>

              {/* Power Filter */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-brand-blue mb-4 flex items-center justify-between">
                  القدرة (حصان)
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="flex flex-wrap gap-2">
                  {powerOptions.map((power) => (
                    <button
                      key={power}
                      onClick={() => togglePower(power)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                        selectedPower.includes(power)
                          ? "bg-[#ff6a00] border-[#ff6a00] text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-[#ff6a00] hover:text-[#ff6a00]"
                      }`}
                    >
                      {power}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voltage Filter */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-brand-blue mb-4 flex items-center justify-between">
                  الجهد الكهربائي
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="flex flex-wrap gap-2">
                  {voltageOptions.map((voltage) => (
                    <button
                      key={voltage}
                      onClick={() => toggleVoltage(voltage)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                        selectedVoltage.includes(voltage)
                          ? "bg-brand-blue border-brand-blue text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue"
                      }`}
                    >
                      {voltage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-bold text-brand-blue mb-4">
                  السعر: حتى {priceRange.toLocaleString("ar-EG")} ج.م
                </h4>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6a00]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1,000 ج.م</span>
                  <span>20,000 ج.م</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-600 font-medium">
                نعرض <span className="text-brand-blue font-bold mx-1">{totalCount}</span> منتج
              </p>
            </div>

            {initialProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 transition-all duration-500 ease-in-out">
                  {initialProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      // Simple logic to show only few pages if totalPages is large
                      if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                        if (page === currentPage - 3 || page === currentPage + 3) return <span key={page}>...</span>;
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                            currentPage === page
                              ? "bg-[#ff6a00] text-white shadow-lg shadow-[#ff6a00]/30"
                              : "border border-gray-200 bg-white text-gray-600 hover:border-[#ff6a00] hover:text-[#ff6a00]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-2">لا توجد نتائج مطابقة</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  لم نتمكن من العثور على أي منتجات تطابق معايير البحث الحالية. حاول تغيير الفلاتر أو مسحها.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  مسح جميع الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

