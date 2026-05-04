import SafeImage from "./SafeImage";
import { Quote, Star } from "lucide-react";
import { normalizeImagePath } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "م. أحمد محمود",
    role: "مهندس – شركة مقاولات",
    text: "منتجات GAST فعلاً قوية وتتحمل الشغل التقيل، استخدمناها في مشاريع كبيرة وكانت ممتازة.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: 2,
    name: "محمد طارق",
    role: "مدير مشتريات",
    text: "جودة عالية جداً وسعر مناسب مقارنة بالسوق، والتوصيل كان سريع.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: 3,
    name: "م. كريم حسن",
    role: "استشاري هيدروليك",
    text: "اشتغلنا بمضخات GAST في أكتر من موقع ومفيش أي مشاكل، أداء ثابت ومحترم.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-24 bg-[#f9f9f9]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-brand-blue mb-4">آراء عملائنا</h2>
          <p className="text-sm md:text-base text-gray-500 font-medium mb-4">ثقة عملائنا هي دليل جودة منتجاتنا</p>
          <div className="w-16 h-1 bg-[#ff6a00] rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative border border-gray-100 animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 opacity-10">
                <Quote className="w-12 h-12 text-[#ff6a00]" fill="currentColor" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#ff6a00]" fill="currentColor" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed font-medium mb-8 relative z-10">
                "{item.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <SafeImage 
                    src={normalizeImagePath(item.image)} 
                    alt={item.name} 
                    fill
                    className="object-cover"
                    sizes="48px"
                  />

                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">{item.role}</p>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
