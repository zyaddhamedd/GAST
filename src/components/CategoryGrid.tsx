import SafeImage from "./SafeImage";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="w-full py-10 md:py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4 text-center">
            تصفح الفئات
          </h2>
          <div className="w-16 h-1 bg-[#ff6a00] rounded-full"></div>
        </div>

        {/* Grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {categories.map((cat, index) => (
              <Link
                href={`/shop?category=${cat.slug}`}
                key={cat.id}
                className="group relative flex flex-col items-center justify-end h-[240px] md:h-[320px] bg-[#f5f5f5] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 ease-out transform active:scale-[0.96] animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 w-full h-full">
                  <SafeImage
                    src={normalizeImagePath(cat.image)}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                  />
                </div>

                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10 pointer-events-none" />

                {/* Text */}
                <div className="relative z-20 flex flex-col items-center mb-6 md:mb-8 px-2 md:px-4 text-center w-full transform transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-white text-base md:text-2xl font-bold mb-2 md:mb-3 drop-shadow-xl">
                    {cat.name}
                  </h3>
                  <div className="w-10 h-1 bg-[#ff6a00] rounded-full opacity-80 group-hover:w-20 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-lg font-medium">
            لا توجد فئات متاحة حالياً
          </div>
        )}

      </div>
    </section>
  );
}
