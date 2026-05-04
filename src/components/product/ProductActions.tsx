"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SafeImage from "../SafeImage";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { normalizeImagePath } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductActionsProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [showStickyAdd, setShowStickyAdd] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyAdd(entry.boundingClientRect.y < 0 && !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    toast.success(`تم إضافة ${quantity} من ${product.name} إلى السلة`, {
      style: {
        borderRadius: "12px",
        background: "#002b5c",
        color: "#fff",
        fontFamily: "inherit",
        fontSize: "14px",
        fontWeight: "bold",
      },
    });
  };

  return (
    <>
      <div className="mb-8" ref={ctaRef}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Quantity */}
          <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-2 w-full sm:w-32 h-14 bg-white shrink-0">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-[#ff6a00] transition-colors">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold text-brand-blue">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-[#ff6a00] transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-[#ff6a00] hover:bg-[#e65c00] disabled:opacity-50 disabled:cursor-not-allowed text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#ff6a00]/30 hover:shadow-[#ff6a00]/50 hover:-translate-y-1"
          >
            <ShoppingCart className="w-6 h-6" />
            {product.inStock ? "أضف للسلة" : "نفذت الكمية"}
          </button>
        </div>

        <Link
          href="/checkout"
          className="w-full bg-brand-blue hover:bg-[#080d26] text-white h-14 rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
        >
          شراء الآن
        </Link>
      </div>

      {/* Sticky Add to Cart */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4 z-50 transition-transform duration-500 ease-in-out ${
          showStickyAdd ? "translate-y-0" : "translate-y-full"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
              <SafeImage src={normalizeImagePath(product.image)} alt={product.name} fill className="object-contain p-1" sizes="48px" />

            </div>
            <div>
              <h4 className="font-bold text-brand-blue text-sm line-clamp-1">{product.name}</h4>
              <span className="text-[#ff6a00] font-black">{product.price.toLocaleString("ar-EG")} ج.م</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden sm:flex items-center justify-between border border-gray-200 rounded-lg px-2 h-12 bg-gray-50 w-28 shrink-0">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-gray-500 hover:text-[#ff6a00]">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-brand-blue">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-gray-500 hover:text-[#ff6a00]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 md:w-48 bg-[#ff6a00] hover:bg-[#e65c00] disabled:opacity-50 text-white h-12 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-[#ff6a00]/20"
            >
              <ShoppingCart className="w-5 h-5" />
              أضف للسلة
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
