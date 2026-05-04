"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { StoreDropdown } from "../StoreDropdown";

interface Category {
  name: string;
  slug: string;
}

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden text-gray-900 p-2 hover:text-brand-blue transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <span className="font-black text-2xl text-brand-blue">القائمة</span>
            <button 
              onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                href="/about" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsOpen(false)}
              >
                معلومات عنا
              </Link>
              <div className="border-b border-gray-50">
                <StoreDropdown isMobile={true} closeMobileMenu={() => setIsOpen(false)} categories={categories} />
              </div>
              <Link 
                href="/faq" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsOpen(false)}
              >
                الأسئلة الشائعة
              </Link>
              <Link 
                href="/contact" 
                className="py-5 px-8 border-b border-gray-50 font-bold text-xl text-gray-800 active:bg-gray-50 active:text-[#ff6a00] transition-all"
                onClick={() => setIsOpen(false)}
              >
                تواصل معنا
              </Link>
            </nav>
          </div>

          <div className="p-8 border-t border-gray-100 bg-white">
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-blue-900/20">
              <User className="w-6 h-6" />
              تسجيل الدخول
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}
