"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Banknote, ChevronRight, Lock } from "lucide-react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod or bank
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus the first input on load
  useEffect(() => {
    const firstInput = document.getElementById("fullName");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }
    if (!formData.governorate) newErrors.governorate = "برجاء اختيار المحافظة";
    if (!formData.city.trim()) newErrors.city = "اسم المدينة مطلوب";
    if (!formData.address.trim()) newErrors.address = "العنوان بالتفصيل مطلوب";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        alert("تم تأكيد طلبك بنجاح! شكراً لثقتك في GAST.");
        setIsSubmitting(false);
      }, 1500);
    } else {
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const mockCartItems = [
    {
      id: 1,
      name: "مضخة مياه غاطسة 1.5 حصان هولمن",
      price: 4500,
      quantity: 1,
      image: "/assets/cat5.png"
    }
  ];

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#f9fafb]" dir="rtl">
      {/* Hide Global Header and Footer using CSS specifically for this page */}
      <style dangerouslySetInnerHTML={{ __html: `header, footer { display: none !important; }` }} />

      {/* Minimal Checkout Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/assets/main logo.png" 
              alt="GAST Logo" 
              width={140} 
              height={40} 
              className="object-contain h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 text-brand-blue font-bold text-lg md:text-xl">
            <Lock className="w-5 h-5 text-green-600" />
            <span>إتمام الطلب بأمان</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/cart" className="hover:text-brand-blue">السلة</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-brand-blue font-bold">الدفع</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* RIGHT SIDE IN RTL (Form) */}
          <div className="w-full lg:w-3/5 space-y-8">
            
            {/* 1. Customer Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-blue mb-6 border-b border-gray-100 pb-4">1. المعلومات الشخصية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue'} focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="الاسم الثلاثي"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue'} focus:outline-none focus:ring-1 transition-colors text-left`}
                    dir="ltr"
                    placeholder="01xxxxxxxxx"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium text-right">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني <span className="text-gray-400 font-normal">(اختياري)</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue transition-colors text-left"
                    dir="ltr"
                    placeholder="example@domain.com"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-blue mb-6 border-b border-gray-100 pb-4">2. عنوان الشحن</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="governorate" className="block text-sm font-bold text-gray-700 mb-2">المحافظة *</label>
                  <select
                    id="governorate"
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.governorate ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue'} focus:outline-none focus:ring-1 transition-colors`}
                  >
                    <option value="">اختر المحافظة</option>
                    <option value="cairo">القاهرة</option>
                    <option value="giza">الجيزة</option>
                    <option value="alex">الإسكندرية</option>
                    <option value="other">أخرى</option>
                  </select>
                  {errors.governorate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.governorate}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2">المدينة / المنطقة *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue'} focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="مدينة نصر، المعادي..."
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">العنوان بالتفصيل *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue'} focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="رقم المبنى، اسم الشارع، تفاصيل أخرى"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-blue mb-6 border-b border-gray-100 pb-4">3. طريقة الدفع</h2>
              
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#ff6a00] bg-orange-50/50 ring-1 ring-[#ff6a00]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="relative flex items-center justify-center w-6 h-6 border-2 rounded-full mr-0 ml-4 border-[#ff6a00]">
                    {paymentMethod === 'cod' && <div className="w-3 h-3 bg-[#ff6a00] rounded-full"></div>}
                  </div>
                  <input type="radio" name="payment" value="cod" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-blue">الدفع عند الاستلام</h3>
                    <p className="text-sm text-gray-500">ادفع نقداً عند استلام طلبك</p>
                  </div>
                  <Banknote className="w-8 h-8 text-gray-400" />
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-[#ff6a00] bg-orange-50/50 ring-1 ring-[#ff6a00]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="relative flex items-center justify-center w-6 h-6 border-2 rounded-full mr-0 ml-4 border-gray-300">
                    {paymentMethod === 'bank' && <div className="w-3 h-3 bg-[#ff6a00] rounded-full"></div>}
                  </div>
                  <input type="radio" name="payment" value="bank" className="hidden" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-700">تحويل بنكي مباشر</h3>
                    <p className="text-sm text-gray-500">تحويل لحساب الشركة البنكي</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* LEFT SIDE IN RTL (Order Summary) */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-brand-blue mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-brand-blue line-clamp-2 leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-brand-blue shrink-0">
                      {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-medium text-brand-blue">{subtotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>تكلفة الشحن</span>
                  <span className="font-medium text-brand-blue">{shipping.toLocaleString("ar-EG")} ج.م</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-brand-blue">الإجمالي</span>
                <span className="text-3xl font-black text-[#ff6a00]">{total.toLocaleString("ar-EG")} <span className="text-lg font-bold text-gray-500">ج.م</span></span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ff6a00] hover:bg-[#e65c00] text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff6a00]/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "تأكيد الطلب"
                )}
              </button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Lock className="w-5 h-5 text-green-500 shrink-0" />
                  <span>بياناتك الشخصية ومعلومات الدفع آمنة تماماً ومحفوظة.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-brand-blue shrink-0" />
                  <span>شحن سريع ومضمون خلال 48 ساعة من تأكيد الطلب.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Banknote className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>متوفر خاصية الدفع نقداً عند استلام المنتج ومراجعته.</span>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
