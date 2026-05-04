"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, Phone, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((s) => s.clearCart);

  // Safety: clear cart if navigated here directly
  useEffect(() => { clearCart(); }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: "header, footer { display: none !important; }" }} />

      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <SafeImage src="/assets/main logo.webp" alt="GAST" width={120} height={36} className="object-contain" />

        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">

          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            تم تأكيد طلبك بنجاح! 🎉
          </h1>
          <p className="text-gray-500 font-medium mb-1">
            شكراً لثقتك في <span className="text-brand-blue font-bold">GAST</span>
          </p>
          {orderId && (
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mt-3 mb-6">
              <span className="text-xs text-gray-400 font-medium">رقم الطلب</span>
              <span className="text-sm font-bold text-brand-blue">#{orderId}</span>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3 mb-8 text-right">
            {[
              { icon: <Phone className="w-4 h-4 text-[#ff6a00]" />, text: "سيتصل بك فريقنا خلال ساعات لتأكيد الطلب" },
              { icon: <Truck className="w-4 h-4 text-brand-blue" />,  text: "سيصلك طلبك خلال 24-48 ساعة من التأكيد" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                  {step.icon}
                </div>
                <p className="text-sm text-gray-600 font-medium">{step.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 w-full bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShoppingBag className="w-5 h-5" />
            متابعة التسوق
          </Link>

          <Link href="/" className="block mt-4 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
