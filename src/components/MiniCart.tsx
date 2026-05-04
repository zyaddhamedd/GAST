"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import SafeImage from "./SafeImage";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  // Optimized selectors
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* Sidebar Cart Container */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-full md:w-[450px] bg-white z-[9999] shadow-[20px_0_60px_rgba(0,0,0,0.1)] flex flex-col"
            dir="rtl"
          >
            {/* Header Section */}
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-brand-blue">سلة التسوق</h3>
                  <p className="text-sm text-gray-400 font-bold">لديك {totalItems} منتجات</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-gray-50 rounded-2xl transition-all group active:scale-90"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />
              </button>
            </div>

            {/* Scrollable Items Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar">
              {items.length > 0 ? (
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 md:gap-6 group"
                    >
                      {/* Product Image Container */}
                      <div className="relative w-24 h-24 md:w-28 md:h-28 bg-[#f9fafb] rounded-3xl overflow-hidden shrink-0 border border-gray-100 group-hover:border-brand-blue/20 transition-colors">
                        <SafeImage 
                          src={normalizeImagePath(item.image)} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-3 transition-transform duration-700 group-hover:scale-110"
                          sizes="112px"
                        />

                      </div>

                      {/* Product Details Area */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-base md:text-lg font-bold text-brand-blue line-clamp-2 leading-tight group-hover:text-[#ff6a00] transition-colors mb-2">
                            {item.name}
                          </h4>
                          <p className="text-xl font-black text-brand-blue">
                            {item.price.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">ج.م</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-brand-blue transition-colors"
                            >
                              <span className="text-xl font-bold">−</span>
                            </button>
                            <span className="font-black text-brand-blue min-w-[20px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-brand-blue transition-colors"
                            >
                              <span className="text-xl font-bold">+</span>
                            </button>
                          </div>

                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-32 h-32 bg-gray-50 rounded-[40px] flex items-center justify-center mb-8 rotate-12">
                    <ShoppingBag className="w-16 h-16 text-gray-200 -rotate-12" />
                  </div>
                  <h4 className="text-2xl font-black text-brand-blue mb-4">السلة فارغة تماماً</h4>
                  <p className="text-gray-400 mb-10 leading-relaxed">لم تقم بإضافة أي منتجات بعد. استمتع بتجربة تسوق فريدة مع منتجاتنا الفاخرة.</p>
                  <Link 
                    href="/shop" 
                    onClick={onClose}
                    className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    ابدأ التسوق الآن
                  </Link>
                </div>
              )}
            </div>

            {/* Premium Footer Section */}
            {items.length > 0 && (
              <div className="p-6 md:p-8 border-t border-gray-50 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-400 font-bold">
                    <span>المجموع الفرعي</span>
                    <span className="text-brand-blue">{(totalPrice * 0.86).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 font-bold">
                    <span>ضريبة القيمة المضافة (14%)</span>
                    <span className="text-brand-blue">{(totalPrice * 0.14).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-brand-blue">الإجمالي الكلي</span>
                    <div className="text-left">
                      <span className="text-3xl font-black text-[#ff6a00]">{totalPrice.toLocaleString()}</span>
                      <span className="text-sm font-bold text-[#ff6a00] mr-1">ج.م</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/checkout" 
                    onClick={onClose}
                    className="w-full py-5 bg-[#ff6a00] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-[#ff6a00]/30 hover:bg-[#e65c00] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    إتمام الطلب
                    <ArrowRight className="w-6 h-6 rotate-180" />
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={onClose}
                    className="w-full py-4 text-gray-400 hover:text-brand-blue font-bold text-center transition-colors"
                  >
                    عرض وتعديل السلة بالكامل
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
