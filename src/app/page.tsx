import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Testimonials } from "@/components/Testimonials";
import { ProductCard, Product } from "@/components/ProductCard";

const featuredProducts: Product[] = [
  { id: 1, name: 'مضخة مياه غاطسة 1.5 حصان', subtitle: 'غاطس مياه زهر بالكامل', image: '/assets/cat5.png', price: 4500, oldPrice: 5200, discount: 13, rating: 5, power: '1.5 HP', voltage: '220V', inStock: true, category: 'غاطس مياه زهر بالكامل' },
  { id: 2, name: 'مضخة اعماق 3 حصان', subtitle: 'غاطس اعماق هولمن', image: '/assets/cat4.png', price: 8900, oldPrice: 9500, discount: 6, rating: 4.5, power: '3 HP', voltage: '380V', inStock: true, category: 'غاطس اعماق هولمن' },
  { id: 3, name: 'مضخة رفع مياه 1 حصان', subtitle: 'مضخات رفع مياه', image: '/assets/cat1.png', price: 2100, oldPrice: 2500, discount: 16, rating: 4, power: '1 HP', voltage: '220V', inStock: true, category: 'مضخات رفع مياه' },
  { id: 4, name: 'غاطس هولمن 5 حصان', subtitle: 'غاطس مياه هولمن', image: '/assets/cat2.png', price: 12500, oldPrice: 14000, discount: 11, rating: 4.8, power: '5 HP', voltage: '380V', inStock: true, category: 'غاطس مياه هولمن' },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      {/* Hero Section */}
      <HeroSlider />

      {/* Category Grid Section */}
      <div className="py-8 md:py-20">
        <CategoryGrid />
      </div>

      {/* Featured Products Section */}
      <section className="py-12 md:py-20 bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">
                منتجات مختارة
              </h2>
              <div className="w-16 h-1 bg-[#ff6a00] rounded-full"></div>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-brand-blue font-bold hover:text-[#ff6a00] transition-colors text-lg">
              عرض كل المنتجات
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <div className="bg-[#f9fafb] border-t border-gray-200 py-12 md:py-0 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col items-center md:items-start text-center md:text-right">
            <h2 className="text-base md:text-sm font-bold text-gray-800 leading-relaxed mb-6">
              منذ بدايتنا، وضعنا في "هولمن" هدفاً واضحاً: تقديم مضخات مياه تجمع بين الكفاءة العالية والتكنولوجيا الألمانية الأصيلة.
            </h2>
            <h3 className="text-2xl md:text-lg font-black text-brand-blue mb-6 md:mb-4">
              هولمن تكنولوجيا ألمانية تُحرّك المياه
            </h3>
            <p className="text-base md:text-sm text-gray-600 mb-6 leading-relaxed">
              نحن لا نصنع مضخات فحسب، بل نصنع حلولاً متكاملة لضخ المياه في المنازل والمصانع والمزارع، تُصمم لتعمل بثبات تحت أصعب الظروف، وتدوم لسنوات طويلة.
            </p>
            <p className="hidden md:block text-sm text-gray-600 mb-4 leading-relaxed">
              تُصنّع منتجات "هولمن" وفقاً لأعلى معايير الجودة الأوروبية، وتخضع لاختبارات دقيقة تضمن الأداء القوي والعمر الطويل. بفضل العزل الكامل ضد الصدأ والتقنيات الحديثة في التبريد والمواتير، أصبحت "هولمن" علامة موثوقة في سوق المضخات.
            </p>
            <p className="text-base md:text-sm text-gray-600 mb-10 leading-relaxed">
              كل مضخة تحمل اسم HOLMEN هي وعد بالجودة، مدعوم بضمان حقيقي لمدة 5 سنوات.
            </p>
            <Link href="/about" className="w-full md:w-auto bg-brand-blue text-white px-10 py-4 md:py-3 rounded-xl md:rounded-full font-bold text-lg md:text-sm hover:bg-blue-900 transition-all active:scale-95 shadow-lg shadow-blue-900/20 text-center">
              اقرأ المزيد
            </Link>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[500px] relative bg-gray-200 mb-8 md:mb-0">
            <Image 
              src="/assets/سكشن 3.png" 
              alt="About Holmen" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-brand-blue/10"></div>
          </div>

        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 md:py-20">
        <Testimonials />
      </div>

    </div>
  );
}
