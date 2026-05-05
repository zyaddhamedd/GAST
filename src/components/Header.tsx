import Link from "next/link";
import SafeImage from "./SafeImage";
import { StoreDropdown } from "./StoreDropdown";
import { MobileMenu } from "./header/MobileMenu";
import { getCategories } from "@/lib/dal";
import { CartStatus } from "./header/CartStatus";
import { SearchButton } from "./header/SearchButton";

export async function Header() {
  const categories = await getCategories();
  
  return (
    <header className="w-full flex flex-col relative z-50">
      {/* Top Bar - High Contrast for instant visibility */}
      <div className="bg-[linear-gradient(to_right,#008C45_33.33%,#FFFFFF_33.33%,#FFFFFF_66.66%,#CD212A_66.66%)] text-gray-900 text-[11px] py-1 text-center flex items-center justify-center font-bold tracking-wider uppercase shadow-sm">
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
            <Link href="/" className="flex items-center justify-center active:scale-90 transition-all duration-300 hover:scale-110 group">
              <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-brand-blue uppercase italic font-serif drop-shadow-sm group-hover:text-[#ff6a00] transition-colors duration-300">
                GAST
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-5">
            <SearchButton />


            
            <CartStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
