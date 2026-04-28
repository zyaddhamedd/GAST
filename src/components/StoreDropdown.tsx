"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";

const categories = [
  { title: "مضخات رفع مياه", slug: "pumps" },
  { title: "غاطس مياه هولمن", slug: "holmen-submersible" },
  { title: "غاطس مياه زهر & استانلس", slug: "cast-iron-stainless" },
  { title: "غاطس مياه استانلس بالكامل", slug: "stainless-full" },
  { title: "غاطس مياه زهر بالكامل", slug: "cast-iron-full" },
  { title: "غاطس اعماق هولمن", slug: "deep-holmen" },
];

interface StoreDropdownProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

export function StoreDropdown({ isMobile = false, closeMobileMenu }: StoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const toggleOpen = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full border-b border-gray-100 last:border-0">
        <div className="flex items-center w-full group">
          <Link 
            href="/shop"
            onClick={closeMobileMenu}
            className="flex-1 py-5 px-8 text-right font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-colors"
          >
            المتجر
          </Link>
          <button 
            onClick={toggleOpen}
            className="px-8 py-5 text-gray-400 active:text-[#ff6a00] transition-colors"
          >
            <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="bg-gray-50/50 border-t border-gray-100">
            {categories.map((category, index) => (
              <li key={index} className={index !== categories.length - 1 ? "border-b border-gray-50" : ""}>
                <Link 
                  href={`/shop?category=${category.slug}`}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-12 py-4.5 text-right text-gray-600 font-bold text-lg active:text-[#ff6a00] transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span>{category.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex items-center h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        href="/shop"
        className={`flex items-center gap-1.5 cursor-pointer font-bold text-sm transition-all duration-300 outline-none h-full ${
          isOpen ? "text-[#ff6a00]" : "text-gray-800 hover:text-brand-blue"
        }`}
      >
        <span>المتجر</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </Link>

      {/* Dropdown Container */}
      <div 
        className={`absolute top-full left-1/2 -translate-x-1/2 w-72 pt-4 z-[100] transition-all duration-300 ease-out ${
          isOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 translate-y-4 invisible"
        }`}
      >
        {/* The Actual Menu */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden backdrop-blur-xl bg-white/95">
          <ul className="py-2">
            {categories.map((category, index) => (
              <li key={index} className={index !== categories.length - 1 ? "mx-5 border-b border-gray-100/60" : ""}>
                <Link 
                  href={`/shop?category=${category.slug}`}
                  className={`flex items-center justify-between py-4 text-right text-gray-700 font-bold hover:text-[#ff6a00] transition-all duration-300 group/item ${
                    index === categories.length - 1 ? "px-5" : "px-0"
                  } hover:translate-x-[-6px]`}
                >
                  <ChevronLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 text-[#ff6a00]" />
                  <span className="flex-1 text-[15px]">{category.title}</span>
                </Link>
              </li>
            ))}
            <li className="bg-gray-50/80 border-t border-gray-100">
               <Link 
                  href="/shop"
                  className="flex items-center justify-center py-4 text-brand-blue font-extrabold hover:text-[#ff6a00] transition-colors"
               >
                 عرض جميع المنتجات
               </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
