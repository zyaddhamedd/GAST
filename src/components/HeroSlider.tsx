"use client";

import { useState, useEffect } from "react";
import SafeImage from "./SafeImage";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { normalizeImagePath } from "@/lib/utils";

const slides = [
  {
    id: 1,
    image: "/assets/heronew1.webp",
    title: "طاقة يمكنك الوثوق بها",
    subtitle: "مضخات ومحركات صناعية فاخرة",
  },
  {
    id: 2,
    image: "/assets/heronew2.webp",
    title: "مُصممة للأداء العالي",
    subtitle: "كفاءة عالية. اعتمادية قصوى.",
  },
  {
    id: 3,
    image: "/assets/heronew3.webp",
    title: "صُممت للأعمال الشاقة",
    subtitle: "حلول صناعية تدوم طويلاً",
  },
  {
    id: 4,
    image: "/assets/heronew4.webp",
    title: "تكنولوجيا GAST",
    subtitle: "دقة. قوة. استدامة",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div 
      className="relative w-full h-[480px] md:h-[calc(100vh-64px)] overflow-hidden bg-black flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
    >
      {/* Background Images & Overlays */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with slight zoom animation */}
          <div
            className={`absolute inset-0 transition-transform duration-[8000ms] ease-out ${
              index === current ? "scale-105" : "scale-100"
            }`}
          >
            <SafeImage 
              src={normalizeImagePath(slide.image)} 
              alt={slide.title}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
              sizes="100vw" // Optimized for full viewport width
            />

          </div>
          
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto h-full flex flex-col justify-center">
        {slides.map((slide, index) => (
          <div
            key={`content-${slide.id}`}
            className={`absolute inset-x-0 mx-auto px-6 md:px-0 md:max-w-3xl transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col items-center md:items-start text-center md:text-right ${
              index === current
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6 pointer-events-none"
            }`}
            style={{ transitionDelay: index === current ? "200ms" : "0ms" }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-wide">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-gray-200 mb-8 md:mb-10 font-medium md:font-light drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              {slide.subtitle}
            </p>
            <Link href="/shop" className="w-fit min-w-[240px] md:w-auto bg-[#ff6a00] active:scale-95 hover:bg-[#ff8000] text-white px-10 md:px-12 py-3.5 md:py-4.5 rounded-xl md:rounded-full font-black text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-orange-500/50 text-center">
              استكشف المنتجات
            </Link>

          </div>
        ))}
      </div>

      {/* Navigation Arrows - Tactile Interaction */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-2 md:px-8 pointer-events-none">
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur-md hover:bg-[#ff6a00] hover:border-[#ff6a00] transition-all duration-200 pointer-events-auto active:scale-90"
        >
          <ChevronRight size={24} className="md:size-32" />
        </button>
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur-md hover:bg-[#ff6a00] hover:border-[#ff6a00] transition-all duration-200 pointer-events-auto active:scale-90"
        >
          <ChevronLeft size={24} className="md:size-32" />
        </button>
      </div>

      {/* Pagination Dots - Instant Response */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current 
                ? "w-10 bg-[#ff6a00]" 
                : "w-2 bg-white/40 hover:bg-white active:scale-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
