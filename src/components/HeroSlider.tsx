"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/assets/هيرو1.png",
    title: "طاقة يمكنك الوثوق بها",
    subtitle: "مضخات ومحركات صناعية فاخرة",
  },
  {
    id: 2,
    image: "/assets/هيرو2.png",
    title: "مُصممة للأداء العالي",
    subtitle: "كفاءة عالية. اعتمادية قصوى.",
  },
  {
    id: 3,
    image: "/assets/هيرو4.png",
    title: "صُممت للأعمال الشاقة",
    subtitle: "حلول صناعية تدوم طويلاً",
  },
  {
    id: 4,
    image: "/assets/هيرو5.png",
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

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

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
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with slight zoom animation */}
          <div
            className={`absolute inset-0 transition-transform duration-[6000ms] ease-out ${
              index === current ? "scale-105" : "scale-100"
            }`}
          >
            {/* Fallback to background color if images don't exist yet */}
            <div 
              className="w-full h-full bg-cover bg-center bg-gray-900"
              style={{ backgroundImage: `url(${encodeURI(slide.image)})` }}
            ></div>
          </div>
          
          {/* Dark Overlay (30-40% opacity) */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center h-full">
        {slides.map((slide, index) => (
          <div
            key={`content-${slide.id}`}
            className={`absolute w-full px-6 md:px-0 max-w-3xl transition-all duration-1000 ease-out flex flex-col items-center md:items-start text-center md:text-right ${
              index === current
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
            }`}
            style={{ transitionDelay: index === current ? "300ms" : "0ms" }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-wide">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-gray-200 mb-8 md:mb-10 font-medium md:font-light drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              {slide.subtitle}
            </p>
            <button className="w-fit min-w-[240px] md:w-auto bg-[#ff6a00] active:scale-95 hover:bg-[#ff8000] text-white px-10 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-full font-bold text-lg md:text-lg transition-all duration-300 transform hover:scale-105 hover:brightness-110 shadow-lg hover:shadow-orange-500/50">
              استكشف المنتجات
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-2 md:px-8 pointer-events-none">
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/10 backdrop-blur-sm hover:bg-black/50 hover:border-white transition-all duration-300 pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 opacity-90" strokeWidth={1.5} />
        </button>
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/10 backdrop-blur-sm hover:bg-black/50 hover:border-white transition-all duration-300 pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 opacity-90" strokeWidth={1.5} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === current 
                ? "w-8 bg-[#ff6a00]" 
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
