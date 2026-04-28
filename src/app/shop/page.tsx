"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard, Product } from "@/components/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

const categories = [
  { id: "1", title: "مضخات رفع مياه", slug: "pumps", image: "/assets/cat1.png" },
  { id: "2", title: "غاطس مياه هولمن", slug: "holmen-submersible", image: "/assets/cat2.png" },
  { id: "3", title: "غاطس مياه زهر & استانلس", slug: "cast-iron-stainless", image: "/assets/cat3.png" },
  { id: "4", title: "غاطس اعماق هولمن", slug: "deep-holmen", image: "/assets/cat4.png" },
  { id: "5", title: "غاطس مياه زهر بالكامل", slug: "cast-iron-full", image: "/assets/cat5.png" },
  { id: "6", title: "غاطس مياه استانلس بالكامل", slug: "stainless-full", image: "/assets/cat6.png" },
];

const mockProducts: Product[] = [
  { id: 1, name: 'مضخة مياه غاطسة 1.5 حصان', subtitle: 'غاطس مياه زهر بالكامل', image: '/assets/cat5.png', price: 4500, oldPrice: 5200, discount: 13, rating: 5, power: '1.5 HP', voltage: '220V', inStock: true, category: 'غاطس مياه زهر بالكامل' },
  { id: 2, name: 'مضخة اعماق 3 حصان', subtitle: 'غاطس اعماق هولمن', image: '/assets/cat4.png', price: 8900, oldPrice: 9500, discount: 6, rating: 4.5, power: '3 HP', voltage: '380V', inStock: true, category: 'غاطس اعماق هولمن' },
  { id: 3, name: 'مضخة رفع مياه 1 حصان', subtitle: 'مضخات رفع مياه', image: '/assets/cat1.png', price: 2100, oldPrice: 2500, discount: 16, rating: 4, power: '1 HP', voltage: '220V', inStock: true, category: 'مضخات رفع مياه' },
  { id: 4, name: 'غاطس استانلس 2 حصان', subtitle: 'غاطس مياه استانلس بالكامل', image: '/assets/cat6.png', price: 6200, rating: 5, power: '2 HP', voltage: '220V', inStock: false, category: 'غاطس مياه استانلس بالكامل' },
  { id: 5, name: 'غاطس هولمن 5 حصان', subtitle: 'غاطس مياه هولمن', image: '/assets/cat2.png', price: 12500, oldPrice: 14000, discount: 11, rating: 4.8, power: '5 HP', voltage: '380V', inStock: true, category: 'غاطس مياه هولمن' },
  { id: 6, name: 'مضخة زهر واستانلس 1.5 حصان', subtitle: 'غاطس مياه زهر & استانلس', image: '/assets/cat3.png', price: 5400, oldPrice: 5900, discount: 8, rating: 4.2, power: '1.5 HP', voltage: '220V', inStock: true, category: 'غاطس مياه زهر & استانلس' },
  { id: 7, name: 'مضخة رفع مياه 2 حصان', subtitle: 'مضخات رفع مياه', image: '/assets/cat1.png', price: 3200, oldPrice: 3800, discount: 15, rating: 4.7, power: '2 HP', voltage: '220V', inStock: true, category: 'مضخات رفع مياه' },
  { id: 8, name: 'غاطس اعماق 7.5 حصان', subtitle: 'غاطس اعماق هولمن', image: '/assets/cat4.png', price: 18000, rating: 4.9, power: '7.5 HP', voltage: '380V', inStock: true, category: 'غاطس اعماق هولمن' },
  { id: 9, name: 'مضخة زهر بالكامل 3 حصان', subtitle: 'غاطس مياه زهر بالكامل', image: '/assets/cat5.png', price: 7800, oldPrice: 8500, discount: 8, rating: 4.6, power: '3 HP', voltage: '380V', inStock: true, category: 'غاطس مياه زهر بالكامل' },
];

const powerOptions = ["1 HP", "1.5 HP", "2 HP", "3 HP", "5 HP", "7.5 HP"];
const voltageOptions = ["220V", "380V"];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPower, setSelectedPower] = useState<string[]>([]);
  const [selectedVoltage, setSelectedVoltage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with URL
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.title);
        // Scroll to products on initial load with category
        const timer = setTimeout(() => {
          productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
        return () => clearTimeout(timer);
      }
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // Simulate loading state for skeleton
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, selectedPower, selectedVoltage, priceRange, inStockOnly]);

  const handleCategoryChange = (title: string) => {
    if (title === "all") {
      router.push("/shop", { scroll: false });
    } else {
      const category = categories.find(c => c.title === title);
      if (category) {
        router.push(`/shop?category=${category.slug}`, { scroll: false });
      }
    }
    setSelectedCategory(title);
  };

  const togglePower = (power: string) => {
    setSelectedPower(prev => 
      prev.includes(power) ? prev.filter(p => p !== power) : [...prev, power]
    );
  };

  const toggleVoltage = (voltage: string) => {
    setSelectedVoltage(prev => 
      prev.includes(voltage) ? prev.filter(v => v !== voltage) : [...prev, voltage]
    );
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      
      // Search filter
      if (searchQuery && !product.name.includes(searchQuery) && !product.subtitle?.includes(searchQuery)) return false;
      
      // Power filter
      if (selectedPower.length > 0 && (!product.power || !selectedPower.includes(product.power))) return false;
      
      // Voltage filter
      if (selectedVoltage.length > 0 && (!product.voltage || !selectedVoltage.includes(product.voltage))) return false;
      
      // Price filter
      if (product.price > priceRange) return false;

      // In Stock filter
      if (inStockOnly && !product.inStock) return false;

      return true;
    });
  }, [selectedCategory, searchQuery, selectedPower, selectedVoltage, priceRange, inStockOnly]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24" dir="rtl">

      {/* Categories Top Section (Horizontal Scroll on Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 mb-8 md:mb-10">
        <div className="bg-white p-2 md:p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-2 md:px-0">
            <h2 className="text-lg md:text-xl font-bold text-brand-blue">تصفح بالفئة</h2>
            {selectedCategory !== "all" && (
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
                onClick={() => handleCategoryChange(cat.title)}
                className={`flex-shrink-0 w-24 md:w-auto group relative rounded-xl overflow-hidden aspect-[1/1] md:aspect-[4/3] flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                  selectedCategory === cat.title 
                    ? "border-[#ff6a00] bg-[#fff7ed] shadow-md ring-2 ring-[#ff6a00]/10" 
                    : "border-transparent bg-gray-50 hover:bg-gray-100 hover:shadow"
                }`}
              >
                <div className="absolute inset-0 p-2 md:p-4">
                  <Image 
                    src={cat.image} 
                    alt={cat.title} 
                    fill 
                    className={`object-contain p-1 md:p-2 group-hover:scale-110 transition-transform duration-500 ${
                      selectedCategory === cat.title ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                    }`} 
                  />
                </div>
                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t pt-4 pb-1 md:pb-2 px-1 text-center transition-colors duration-300 ${
                  selectedCategory === cat.title ? "from-[#fff7ed] via-[#fff7ed]/90" : "from-white via-white/80"
                } to-transparent`}>
                  <span className={`text-[10px] md:text-sm font-bold transition-colors leading-tight ${
                    selectedCategory === cat.title ? "text-[#ff6a00]" : "text-brand-blue group-hover:text-[#ff6a00]"
                  }`}>
                    {cat.title}
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
              {filteredProducts.length} منتج
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
          <div className={`w-full lg:w-1/4 space-y-6 lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-brand-blue flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  تصنيف المنتجات
                </h3>
                {(searchQuery || selectedPower.length > 0 || selectedVoltage.length > 0 || priceRange < 20000 || inStockOnly) && (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedPower([]);
                      setSelectedVoltage([]);
                      setPriceRange(20000);
                      setInStockOnly(false);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
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

              {/* Availability */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded overflow-hidden group-hover:border-[#ff6a00] transition-colors bg-white mr-0 ml-3">
                    <input 
                      type="checkbox" 
                      className="absolute opacity-0 cursor-pointer"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    {inStockOnly && <div className="absolute inset-0 bg-[#ff6a00] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
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
                  {powerOptions.map(power => (
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
                  {voltageOptions.map(voltage => (
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

              {/* Price Range Slider */}
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
                نعرض <span className="text-brand-blue font-bold mx-1">{filteredProducts.length}</span> منتج
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">ترتيب حسب:</span>
                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#ff6a00] focus:border-[#ff6a00] block p-2 outline-none cursor-pointer">
                  <option>الأكثر تطابقاً</option>
                  <option>السعر: من الأقل للأعلى</option>
                  <option>السعر: من الأعلى للأقل</option>
                  <option>الأحدث</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-xl h-[320px] md:h-[420px] p-3 md:p-4 flex flex-col animate-pulse shadow-sm border border-gray-100">
                    <div className="bg-gray-200 h-32 md:h-48 w-full rounded-lg mb-3 md:mb-4"></div>
                    <div className="bg-gray-200 h-3 md:h-4 w-1/2 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-5 md:h-6 w-3/4 mb-4 rounded"></div>
                    <div className="mt-auto bg-gray-200 h-8 md:h-10 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 transition-all duration-500 ease-in-out">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
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
                  onClick={() => {
                    setSearchQuery("");
                    handleCategoryChange("all");
                    setSelectedPower([]);
                    setSelectedVoltage([]);
                    setPriceRange(20000);
                    setInStockOnly(false);
                  }}
                  className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  مسح جميع الفلاتر
                </button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                    <span className="sr-only">السابق</span>
                    &raquo;
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ff6a00] text-white font-bold shadow-md shadow-[#ff6a00]/20">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    <span className="sr-only">التالي</span>
                    &laquo;
                  </button>
                </nav>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a00]"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
