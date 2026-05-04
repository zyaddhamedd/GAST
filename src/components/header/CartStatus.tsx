"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { MiniCart } from "../MiniCart";

export function CartStatus() {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Optimized selectors to prevent unnecessary re-renders
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsMiniCartOpen(!isMiniCartOpen)}
        className="flex items-center gap-2 md:gap-3 group focus:outline-none active:scale-95 transition-transform"
      >
        <span className="hidden lg:block text-sm font-extrabold text-gray-900 group-hover:text-brand-blue transition-colors">
          سلة المشتريات / {mounted ? totalPrice.toLocaleString() : 0} EGP
        </span>
        <div className="relative">
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-900 group-hover:text-brand-blue transition-colors" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in duration-300">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </div>
  );
}
