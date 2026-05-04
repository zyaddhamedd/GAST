"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
  };
  variant?: "small" | "large";
}

export function AddToCartButton({ product, variant = "small" }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(`تم إضافة ${product.name} إلى السلة`, {
      style: {
        borderRadius: "16px",
        background: "#0b1130",
        color: "#fff",
        fontFamily: "inherit",
        fontSize: "14px",
        fontWeight: "bold",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    });
  };

  if (variant === "small") {
    return (
      <button
        className="w-full flex items-center justify-center gap-1.5 bg-orange-500 active:scale-95 hover:bg-orange-600 text-white py-2 md:py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
        disabled={!product.inStock}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5 transition-transform group-hover/btn:-rotate-12" />
        <span className="text-[10px] md:text-sm uppercase tracking-tight">{product.inStock ? "أضف للسلة" : "نفذ"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!product.inStock}
      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 group/btn"
    >
      <ShoppingCart className="w-6 h-6 transition-transform group-hover/btn:-rotate-12" />
      {product.inStock ? "أضف للسلة" : "نفذت الكمية"}
    </button>
  );
}
