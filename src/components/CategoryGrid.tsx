"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const categories = [
  { id: 1, title: "مضخات رفع مياه", slug: "pumps", image: "/assets/cat1.png" },
  { id: 2, title: "غاطس مياه هولمن", slug: "holmen-submersible", image: "/assets/cat2.png" },
  { id: 3, title: "غاطس مياه زهر & استانلس", slug: "cast-iron-stainless", image: "/assets/cat3.png" },
  { id: 4, title: "غاطس اعماق هولمن", slug: "deep-holmen", image: "/assets/cat4.png" },
  { id: 5, title: "غاطس مياه زهر بالكامل", slug: "cast-iron-full", image: "/assets/cat5.png" },
  { id: 6, title: "غاطس مياه استانلس بالكامل", slug: "stainless-full", image: "/assets/cat6.png" },
];

export function CategoryGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-10 md:py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4 text-center">
            تصفح الفئات
          </h2>
          <div className="w-16 h-1 bg-[#ff6a00] rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {categories.map((cat, index) => (
            <Link 
              href={`/shop?category=${cat.slug}`}
              key={cat.id}
              className={`group relative flex flex-col items-center justify-end h-[240px] md:h-[320px] bg-[#f5f5f5] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 ease-out transform active:scale-[0.96] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              {/* Permanent Bottom Gradient for Text Readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10 transition-opacity duration-300"></div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10 pointer-events-none"></div>

              {/* Text Content */}
              <div className="relative z-20 flex flex-col items-center mb-6 md:mb-8 px-2 md:px-4 text-center w-full transform transition-all duration-300 group-hover:-translate-y-2">
                <h3 className="text-white text-base md:text-2xl font-bold mb-2 md:mb-3 drop-shadow-xl">
                  {cat.title}
                </h3>
                <div className="w-10 h-1 bg-[#ff6a00] rounded-full opacity-80 group-hover:w-20 transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
