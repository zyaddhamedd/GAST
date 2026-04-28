"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  Truck, ShieldCheck, CreditCard 
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-blue mb-4">السلة فارغة</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            يبدو أنك لم تقم بإضافة أي منتجات إلى سلة المشتريات حتى الآن. استكشف منتجاتنا المميزة وابدأ التسوق.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#080d26] transition-all shadow-lg"
          >
            تصفح المنتجات
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-24 pt-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-brand-blue mb-8">سلة المشتريات ({getTotalItems()})</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items List */}
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 md:gap-6 md:items-center relative"
                >
                  {/* Product Image */}
                  <div className="relative w-full md:w-32 aspect-square md:h-32 bg-[#f9fafb] rounded-xl overflow-hidden shrink-0 border border-gray-50">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-2 md:p-4"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`} className="block">
                      <h3 className="font-extrabold text-brand-blue text-lg md:text-xl hover:text-[#ff6a00] transition-colors line-clamp-2 md:line-clamp-1 leading-tight mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between md:block">
                      <p className="text-[#ff6a00] font-black text-xl md:text-2xl">
                        {item.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">ج.م</span>
                      </p>
                      
                      {/* Remove Button Mobile (Absolute Top Right) */}
                      <button 
                        onClick={() => {
                          removeItem(item.id);
                          toast.error("تم إزالة المنتج من السلة");
                        }}
                        className="md:hidden p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-full transition-colors absolute top-4 left-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Mobile Controls */}
                    <div className="flex md:hidden items-center justify-between mt-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-6 border-2 border-gray-100 rounded-xl px-4 py-2 bg-white shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-[#ff6a00] active:scale-90 transition-all p-1"
                        >
                          <Minus className="w-6 h-6" />
                        </button>
                        <span className="font-black text-brand-blue text-xl w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-[#ff6a00] active:scale-90 transition-all p-1"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">الإجمالي</p>
                        <p className="text-brand-blue font-black text-lg">{(item.price * item.quantity).toLocaleString()} ج.م</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Controls Only */}
                  <div className="hidden md:flex flex-col items-end gap-4 shrink-0">
                    <div className="flex items-center gap-4 border-2 border-gray-100 rounded-xl px-3 py-1.5 bg-white shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-[#ff6a00] transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-extrabold text-brand-blue text-lg w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-[#ff6a00] transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        removeItem(item.id);
                        toast.error("تم إزالة المنتج من السلة");
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      إزالة المنتج
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-brand-blue">شحن سريع وآمن</p>
                  <p className="text-gray-500">لجميع المحافظات</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-brand-blue">ضمان حقيقي</p>
                  <p className="text-gray-500">على جميع المنتجات</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-[#ff6a00] rounded-full flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-brand-blue">دفع عند الاستلام</p>
                  <p className="text-gray-500">أو ببطاقة الائتمان</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-brand-blue mb-6 border-b border-gray-100 pb-4">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{subtotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>تكلفة الشحن</span>
                  <span className="font-bold text-green-600">
                    {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg">
                    أضف منتجات بقيمة {(5000 - subtotal).toLocaleString()} ج.م إضافية للحصول على شحن مجاني!
                  </p>
                )}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold text-brand-blue">الإجمالي الكلي</span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-[#ff6a00]">{total.toLocaleString()} ج.م</span>
                    <span className="text-[10px] text-gray-400">(شامل ضريبة القيمة المضافة)</span>
                  </div>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-[#ff6a00] hover:bg-[#e65c00] text-white py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-[#ff6a00]/30 transition-all hover:-translate-y-1 active:scale-[0.98]"
              >
                إتمام الطلب
                <ArrowRight className="w-6 h-6 rotate-180" />
              </Link>

              <div className="mt-6 space-y-3">
                <p className="text-center text-xs text-gray-400">نحن نقبل:</p>
                <div className="flex justify-center gap-4 grayscale opacity-50">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={20} />
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={30} height={20} />
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={50} height={20} />
                </div>
              </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-100 p-4 pb-8 z-40 shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
               <div className="flex items-center justify-between gap-6">
                  <div className="shrink-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">الإجمالي الكلي</p>
                    <p className="text-2xl font-black text-brand-blue">{total.toLocaleString()} ج.م</p>
                  </div>
                  <Link 
                    href="/checkout" 
                    className="flex-1 bg-[#ff6a00] active:scale-[0.98] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/30 transition-all"
                  >
                    إتمام الطلب
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
