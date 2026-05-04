import { Suspense } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { Testimonials } from "@/components/Testimonials";
import { HomeCategoryGrid } from "@/components/HomeCategoryGrid";
import { CategoryGridSkeleton } from "@/components/Skeletons";


export const dynamic = 'force-dynamic';

export default async function Home() {
  // No top-level awaits here! 
  // This allows the Header/Layout and Hero Section to render immediately.

  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      {/* Hero Section - Static content, renders immediately */}
      <HeroSlider />

      {/* Category Grid Section - Streamed */}
      <div className="py-8 md:py-20">
        <Suspense fallback={<CategoryGridSkeleton />}>
          <HomeCategoryGrid />
        </Suspense>
      </div>

      {/* About Section - Static, renders immediately */}
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
            <SafeImage 
              src="/assets/سكشن 3.webp" 
              alt="About Holmen" 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 50vw"
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
