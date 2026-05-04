import Link from "next/link";
import SafeImage from "./SafeImage";
import { Search, User } from "lucide-react";
import { StoreDropdown } from "./StoreDropdown";
import { MobileMenu } from "./header/MobileMenu";
import { getCategories } from "@/lib/dal";
import { CartStatus } from "./header/CartStatus";

export async function Header() {
  const categories = await getCategories();
  
  return (
    <header className="w-full flex flex-col relative z-50">
      {/* Top Bar - High Contrast for instant visibility */}
      <div className="bg-brand-blue text-white text-[11px] py-1 text-center flex items-center justify-center font-bold tracking-wider uppercase">
        عرض اليوم: شحن مجاني لجميع الطلبات في مصر
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between relative flex-row-reverse md:flex-row">
          
          {/* Right: Tactile Nav Links */}
          <div className="flex items-center h-full">
            <MobileMenu categories={categories} />

            <nav className="hidden md:flex items-center gap-8 font-black text-xs text-gray-900 h-full tracking-wide">
              <Link href="/about" prefetch={true} className="hover:text-[#ff6a00] transition-all duration-150 h-full flex items-center active:scale-95">معلومات عنا</Link>
              <StoreDropdown categories={categories} />
              <Link href="/faq" prefetch={true} className="hover:text-[#ff6a00] transition-all duration-150 h-full flex items-center active:scale-95">الأسئلة الشائعة</Link>
              <Link href="/contact" prefetch={true} className="hover:text-[#ff6a00] transition-all duration-150 h-full flex items-center active:scale-95">تواصل معنا</Link>
            </nav>
          </div>

          {/* Center: Massive Optimized Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
            <Link href="/" className="flex items-center justify-center active:scale-90 transition-transform">
              <div className="relative h-16 md:h-20 lg:h-24 w-40 md:w-56 lg:w-64">
                <SafeImage 
                  src="/assets/main logo.webp" 
                  alt="GAST Logo" 
                  fill
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 256px"
                  className="object-contain transition-all duration-500 hover:scale-105"
                  priority
                />

              </div>
            </Link>
          </div>

          {/* Left: Instant Action Buttons */}
          <div className="flex items-center gap-2 md:gap-5">
            <button className="hidden sm:flex p-2 text-gray-900 hover:text-[#ff6a00] transition-all active:scale-90">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/admin/login" className="hidden md:flex p-2 text-gray-900 hover:text-[#ff6a00] transition-all active:scale-90">
              <User className="w-5 h-5" />
            </Link>

            
            <CartStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
