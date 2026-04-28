"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { StoreDropdown } from "./StoreDropdown";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col relative z-50">
      {/* Top Bar */}
      <div className="bg-brand-blue text-white text-[11px] py-1 text-center flex items-center justify-center font-medium">
        عرض اليوم شحن مجاني لجميع الطلبات
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between relative flex-row-reverse md:flex-row">
          
          {/* Right: Navigation Links (Desktop) & Menu Icon (Mobile) */}
          <div className="flex items-center h-full">
            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden text-gray-900 p-2 hover:text-brand-blue transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-800 h-full">
              <Link href="/about" className="hover:text-brand-blue transition-colors h-full flex items-center">معلومات عنا</Link>
              <StoreDropdown />
              <Link href="/faq" className="hover:text-brand-blue transition-colors h-full flex items-center">الأسئلة الشائعة</Link>
              <Link href="/contact" className="hover:text-brand-blue transition-colors h-full flex items-center">تواصل معنا</Link>
            </nav>
          </div>

          {/* Center: POP-OUT Massive Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
            <Link href="/" className="flex items-center justify-center">
              <Image 
                src="/assets/main logo.png" 
                alt="Main Logo" 
                width={400} 
                height={120} 
                className="object-contain h-16 md:h-20 lg:h-24 w-auto transition-all duration-500 hover:scale-110 drop-shadow-md"
                priority
              />
            </Link>
          </div>

          {/* Left: Icons & Cart */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="hidden text-gray-900 hover:text-brand-blue transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:block text-gray-900 hover:text-brand-blue transition-colors">
              <User className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden lg:block text-sm font-extrabold text-gray-900">سلة المشتريات / 0 EGP</span>
              <div className="relative">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[280px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <span className="font-black text-2xl text-brand-blue">القائمة</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
            >
              <X className="w-8 h-8 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col text-right">
              <Link 
                href="/" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                href="/about" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                معلومات عنا
              </Link>
              <div className="border-b border-gray-50">
                <StoreDropdown isMobile={true} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
              </div>
              <Link 
                href="/faq" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الأسئلة الشائعة
              </Link>
              <Link 
                href="/contact" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تواصل معنا
              </Link>
            </nav>
          </div>

          <div className="p-8 border-t border-gray-100 bg-white">
            <button className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-blue-900/20">
              <User className="w-6 h-6" />
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

