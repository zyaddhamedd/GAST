"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { 
  ShoppingCart, Star, Truck, ShieldCheck, Award, 
  Plus, Minus, CheckCircle2, ChevronLeft, ChevronRight
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

// Mock Product Data
const productInfo = {
  id: "1",
  name: "مضخة مياه غاطسة 1.5 حصان هولمن أصلية",
  subtitle: "مثالية للمنازل والمصانع وأصعب ظروف العمل مع تحمل الضغط العالي",
  price: 4500,
  oldPrice: 5200,
  discount: 13,
  rating: 4.8,
  reviewsCount: 124,
  inStock: true,
  images: [
    "/assets/cat5.png",
    "/assets/cat1.png",
    "/assets/cat3.png",
    "/assets/cat4.png"
  ],
  features: [
    "صناعة ألمانية بخامات عالية الجودة",
    "ضمان 5 سنوات ضد عيوب الصناعة",
    "أداء عالي تحت ضغط التشغيل المستمر",
    "مقاومة كاملة للصدأ والتآكل",
    "مناسبة للمنازل والمصانع والمشروعات الزراعية"
  ],
  specs: {
    "القدرة (HP)": "1.5 حصان",
    "الجهد (Voltage)": "220V",
    "بلد المنشأ": "ألمانيا",
    "الضمان": "5 سنوات",
    "الخامة": "زهر بالكامل",
    "أقصى تدفق": "100 لتر/دقيقة",
    "أقصى ارتفاع": "50 متر"
  },
  description: "المضخة الغاطسة هولمن من أفضل المضخات الصناعية المصممة للعمل الشاق والمستمر. تم تصنيعها باستخدام أحدث التقنيات الألمانية لضمان الكفاءة القصوى واستهلاك منخفض للطاقة. بفضل الهيكل المصنوع من الزهر بالكامل، تضمن لك هذه المضخة عمراً افتراضياً طويلاً ومقاومة تامة للتآكل والصدأ في أقسى ظروف التشغيل."
};

// Mock Related Products
const relatedProducts = [
  { id: 2, name: 'مضخة اعماق 3 حصان', subtitle: 'غاطس اعماق هولمن', image: '/assets/cat4.png', price: 8900, oldPrice: 9500, discount: 6, rating: 4.5, power: '3 HP', voltage: '380V', inStock: true, category: 'غاطس اعماق هولمن' },
  { id: 3, name: 'مضخة رفع مياه 1 حصان', subtitle: 'مضخات رفع مياه', image: '/assets/cat1.png', price: 2100, oldPrice: 2500, discount: 16, rating: 4, power: '1 HP', voltage: '220V', inStock: true, category: 'مضخات رفع مياه' },
  { id: 4, name: 'غاطس استانلس 2 حصان', subtitle: 'غاطس مياه استانلس بالكامل', image: '/assets/cat6.png', price: 6200, rating: 5, power: '2 HP', voltage: '220V', inStock: true, category: 'غاطس مياه استانلس بالكامل' },
  { id: 5, name: 'غاطس هولمن 5 حصان', subtitle: 'غاطس مياه هولمن', image: '/assets/cat2.png', price: 12500, rating: 4.8, power: '5 HP', voltage: '380V', inStock: true, category: 'غاطس مياه هولمن' },
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantityStore = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showStickyAdd, setShowStickyAdd] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<{
    display: string;
    backgroundPosition: string;
    backgroundImage?: string;
  }>({ display: 'none', backgroundPosition: '0% 0%' });

  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Sticky CTA Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky when the main CTA is out of view above the screen
        setShowStickyAdd(entry.boundingClientRect.y < 0 && !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Image Zoom Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${productInfo.images[activeImageIndex]})`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const handleAddToCart = () => {
    addItem({
      id: productInfo.id,
      name: productInfo.name,
      price: productInfo.price,
      image: productInfo.images[0],
    }, quantity);

    toast.success(`تم إضافة ${quantity} من ${productInfo.name} إلى السلة`, {
      style: {
        borderRadius: '12px',
        background: '#002b5c',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24" dir="rtl">
      {/* Breadcrumb Strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ff6a00] transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#ff6a00] transition-colors">المتجر</Link>
            <span>/</span>
            <span className="text-brand-blue font-bold truncate max-w-[200px] sm:max-w-none">{productInfo.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-12">
          
          {/* Main Product Section */}
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* RIGHT SIDE (Image Gallery) - Using Left visual placement due to RTL */}
            <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-24 shrink-0">
                {productInfo.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-[#ff6a00] shadow-md ring-2 ring-[#ff6a00]/20" : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2 bg-[#f9fafb]" />
                  </button>
                ))}
              </div>

              {/* Main Image with Zoom */}
              <div 
                className="relative w-full aspect-square bg-[#f9fafb] rounded-2xl overflow-hidden border border-gray-100 group cursor-crosshair"
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Badges */}
                {productInfo.discount && (
                  <div className="absolute top-4 right-4 z-10 bg-[#ff6a00] text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                    خصم {productInfo.discount}%
                  </div>
                )}
                {productInfo.inStock && (
                  <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> متوفر
                  </div>
                )}

                {/* Base Image */}
                <Image 
                  src={productInfo.images[activeImageIndex]} 
                  alt={productInfo.name} 
                  fill 
                  className="object-contain p-8 transition-opacity duration-300" 
                  priority
                />

                {/* Zoom Overlay */}
                <div 
                  className="absolute inset-0 bg-no-repeat bg-white transition-opacity duration-200 pointer-events-none"
                  style={{
                    ...zoomStyle,
                    backgroundSize: '250%',
                    opacity: zoomStyle.display === 'block' ? 1 : 0
                  }}
                />
              </div>
            </div>

            {/* LEFT SIDE (Product Info) */}
            <div className="w-full lg:w-1/2 flex flex-col">
              
              {/* Header Info */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-3 leading-tight">
                  {productInfo.name}
                </h1>
                <p className="text-gray-500 text-lg mb-4">{productInfo.subtitle}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(productInfo.rating) ? "fill-[#ffc107] text-[#ffc107]" : "fill-gray-200 text-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-brand-blue font-bold text-sm bg-gray-100 px-2 py-1 rounded-md">{productInfo.rating}</span>
                  <span className="text-gray-400 text-sm">({productInfo.reviewsCount} تقييم)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-end gap-4">
                  <span className="text-4xl font-black text-[#ff6a00]">
                    {productInfo.price.toLocaleString("ar-EG")} <span className="text-lg font-bold text-gray-500">ج.م</span>
                  </span>
                  {productInfo.oldPrice && (
                    <span className="text-xl text-gray-400 line-through mb-1 font-medium">
                      {productInfo.oldPrice.toLocaleString("ar-EG")} ج.م
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">الأسعار تشمل ضريبة القيمة المضافة</p>
              </div>

              {/* Key Features */}
              <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-brand-blue mb-4 text-lg">أهم المميزات:</h3>
                <ul className="space-y-3">
                  {productInfo.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Area */}
              <div className="mb-8" ref={ctaRef}>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-2 w-full sm:w-32 h-14 bg-white shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-gray-500 hover:text-[#ff6a00] transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold text-brand-blue">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-gray-500 hover:text-[#ff6a00] transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Primary Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#ff6a00] hover:bg-[#e65c00] text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#ff6a00]/30 hover:shadow-[#ff6a00]/50 hover:-translate-y-1"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    أضف للسلة
                  </button>
                </div>
                
                {/* Secondary Button */}
                <Link href="/checkout" className="w-full bg-brand-blue hover:bg-[#080d26] text-white h-14 rounded-xl font-bold text-lg transition-colors flex items-center justify-center">
                  شراء الآن
                </Link>
              </div>

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

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
            {["description", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-lg font-bold transition-colors whitespace-nowrap relative ${
                  activeTab === tab ? "text-[#ff6a00]" : "text-gray-500 hover:text-brand-blue"
                }`}
              >
                {tab === "description" ? "الوصف" : tab === "specs" ? "المواصفات التقنية" : "المراجعات (124)"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6a00] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-8 lg:p-10">
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                <p>{productInfo.description}</p>
                <p className="mt-4">
                  تم تصميم هذه المضخة باستخدام سبائك عالية الجودة تتحمل أقصى ظروف التشغيل، مما يجعلها الخيار الأمثل للمقاولين وأصحاب المصانع الذين يبحثون عن الموثوقية التامة والأداء الثابت الذي لا يتأثر بمرور الزمن.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-3xl">
                <table className="w-full text-right border-collapse">
                  <tbody>
                    {Object.entries(productInfo.specs).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <th className="py-4 px-6 border-b border-gray-100 text-brand-blue font-bold w-1/3">{key}</th>
                        <td className="py-4 px-6 border-b border-gray-100 text-gray-600 font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-10">
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-8 h-8 ${i < Math.floor(productInfo.rating) ? "fill-[#ffc107] text-[#ffc107]" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-brand-blue mb-2">تقييم ممتاز (4.8/5)</h3>
                <p className="text-gray-500 mb-6">بناءً على 124 مراجعة من المشترين</p>
                <button className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-[#080d26] transition-colors shadow-lg">
                  اكتب مراجعة
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue relative inline-block">
              منتجات ذات صلة
              <div className="absolute -bottom-2 right-0 w-1/2 h-1.5 bg-[#ff6a00] rounded-full"></div>
            </h2>
            <div className="hidden md:flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#ff6a00] hover:text-white hover:border-[#ff6a00] transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#ff6a00] hover:text-white hover:border-[#ff6a00] transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod as any} />
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Add to Cart Bar (Bottom Desktop / Mobile) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4 z-50 transition-transform duration-500 ease-in-out ${
          showStickyAdd ? "translate-y-0" : "translate-y-full"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
              <Image src={productInfo.images[0]} alt={productInfo.name} fill className="object-contain p-1" />
            </div>
            <div>
              <h4 className="font-bold text-brand-blue text-sm line-clamp-1">{productInfo.name}</h4>
              <span className="text-[#ff6a00] font-black">{productInfo.price.toLocaleString("ar-EG")} ج.م</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden sm:flex items-center justify-between border border-gray-200 rounded-lg px-2 h-12 bg-gray-50 w-28 shrink-0">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-gray-500 hover:text-[#ff6a00]">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-brand-blue">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-gray-500 hover:text-[#ff6a00]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 md:w-48 bg-[#ff6a00] hover:bg-[#e65c00] text-white h-12 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-[#ff6a00]/20"
            >
              <ShoppingCart className="w-5 h-5" />
              أضف للسلة
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
