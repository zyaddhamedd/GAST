"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send,
  ShieldCheck,
  Zap,
  Wrench,
  Loader2
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[35vh] md:h-[45vh] min-h-[300px] md:min-h-[350px] w-full flex items-center justify-center overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 opacity-20">
           <Image src="/assets/هيرو1.png" alt="Contact Bg" fill className="object-cover blur-sm" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 to-brand-blue"></div>
        <div className="relative z-10 text-center px-4 animate-fade-in max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-7xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-2xl">تواصل معنا</h1>
          <p className="text-lg md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed">
            نحن هنا لمساعدتك في اختيار الحل المناسب وضمان أفضل أداء لمشاريعك، تواصل معنا الآن.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          
          {/* Contact Info - Right */}
          <div className="space-y-8 md:space-y-12 lg:sticky lg:top-24">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-brand-blue mb-4 md:mb-6">معلومات التواصل</h2>
              <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed max-w-md">
                يمكنك زيارتنا في مكتبنا أو التواصل معنا مباشرة عبر أي من القنوات المتاحة بالأسفل.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { icon: <MapPin className="w-5 h-5 md:w-7 md:h-7" />, title: "العنوان", content: "القاهرة، مصر", sub: "المركز الرئيسي" },
                { icon: <Phone className="w-5 h-5 md:w-7 md:h-7" />, title: "الهاتف", content: "+20 XXX...", sub: "اتصال مباشر" },
                { icon: <Mail className="w-5 h-5 md:w-7 md:h-7" />, title: "البريد", content: "info@gast...", sub: "للمراسلات" },
                { icon: <Clock className="w-5 h-5 md:w-7 md:h-7" />, title: "المواعيد", content: "9 ص - 6 م", sub: "يومياً" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 md:gap-5 p-1 transition-all">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-blue shadow-sm border border-gray-100 group hover:bg-brand-blue hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-brand-blue text-base md:text-xl mb-0.5 md:mb-1">{item.title}</h3>
                    <p className="text-gray-900 font-bold mb-0.5 md:mb-1 text-sm md:text-lg truncate">{item.content}</p>
                    <p className="text-gray-500 font-medium text-[10px] md:text-sm">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
               <a href="https://wa.me/..." className="flex-1 flex items-center justify-center gap-4 bg-[#25d366] text-white py-5 px-8 rounded-2xl font-extrabold text-xl hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-green-500/20 group">
                  <MessageCircle className="w-7 h-7 group-hover:animate-bounce" />
                  تواصل عبر واتساب
               </a>
               <a href="tel:..." className="flex-1 flex items-center justify-center gap-4 bg-brand-blue text-white py-5 px-8 rounded-2xl font-extrabold text-xl hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-brand-blue/20">
                  <Phone className="w-7 h-7" />
                  اتصال مباشر
               </a>
            </div>

            {/* Trust Elements (Horizontal Scroll on Mobile) */}
            <div className="flex lg:grid lg:grid-cols-3 items-center justify-between py-4 md:py-8 px-4 md:px-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100 overflow-x-auto no-scrollbar gap-4 md:gap-0">
               <div className="flex items-center gap-2 md:gap-3 shrink-0">
                 <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                 <span className="font-extrabold text-brand-blue text-xs md:text-sm whitespace-nowrap">بياناتك آمنة</span>
               </div>
               <div className="hidden md:block w-px h-8 bg-gray-200 mx-auto"></div>
               <div className="flex items-center gap-2 md:gap-3 shrink-0">
                 <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#ff6a00]" />
                 <span className="font-extrabold text-brand-blue text-xs md:text-sm whitespace-nowrap">رد سريع جداً</span>
               </div>
               <div className="hidden md:block w-px h-8 bg-gray-200 mx-auto"></div>
               <div className="flex items-center gap-2 md:gap-3 shrink-0">
                 <Wrench className="w-5 h-5 md:w-6 md:h-6 text-brand-blue" />
                 <span className="font-extrabold text-brand-blue text-xs md:text-sm whitespace-nowrap">دعم متخصص</span>
               </div>
            </div>
          </div>

          {/* Contact Form - Left */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-gray-50 lg:translate-y-[-40px]">
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-brand-blue mb-2 md:mb-4">أرسل لنا رسالة</h2>
              <p className="text-sm md:text-gray-500 font-medium">املأ النموذج وسيقوم خبراؤنا بالرد عليك خلال ساعات قليلة.</p>
            </div>
            
            {isSubmitted ? (
              <div className="py-12 md:py-20 text-center animate-scale-in">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
                   <ShieldCheck className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-blue mb-4">تم الإرسال بنجاح!</h3>
                <p className="text-lg md:text-xl text-gray-500 font-medium mb-8 md:mb-10">شكراً لتواصلك مع GAST. سنتصل بك قريباً جداً.</p>
                <button onClick={() => setIsSubmitted(false)} className="text-[#ff6a00] font-extrabold text-lg underline underline-offset-8 decoration-2 hover:text-brand-blue transition-colors">
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm md:text-base font-extrabold text-brand-blue pr-2 block">الاسم بالكامل</label>
                    <input 
                      type="text" 
                      placeholder="أحمد محمد"
                      className="w-full h-14 md:h-16 px-6 md:px-7 rounded-xl md:rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/5 outline-none transition-all font-bold text-brand-blue text-base md:text-lg shadow-sm"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm md:text-base font-extrabold text-brand-blue pr-2 block">رقم الهاتف *</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="01xxxxxxxxx"
                      className="w-full h-14 md:h-16 px-6 md:px-7 rounded-xl md:rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/5 outline-none transition-all font-bold text-brand-blue text-base md:text-lg shadow-sm"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-sm md:text-base font-extrabold text-brand-blue pr-2 block">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full h-14 md:h-16 px-6 md:px-7 rounded-xl md:rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/5 outline-none transition-all font-bold text-brand-blue text-base md:text-lg shadow-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-sm md:text-base font-extrabold text-brand-blue pr-2 block">كيف يمكننا مساعدتك؟</label>
                  <textarea 
                    rows={4}
                    placeholder="اكتب تفاصيل طلبك هنا..."
                    className="w-full p-6 md:p-7 rounded-xl md:rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/5 outline-none transition-all font-bold text-brand-blue text-base md:text-lg shadow-sm resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                
                <button 
                  disabled={isSubmitting}
                  className="w-full h-16 md:h-20 bg-[#ff6a00] hover:bg-[#e65c00] text-white font-extrabold text-lg md:text-xl rounded-xl md:rounded-2xl shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3 md:gap-4 disabled:opacity-70 active:scale-[0.98] group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                  ) : (
                    <>
                      <span>إرسال الرسالة الآن</span>
                      <Send className="w-5 h-5 md:w-6 md:h-6 transform rotate-[180deg] group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-12 md:pb-24 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto h-[350px] md:h-[550px] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-[6px] md:border-[12px] border-white ring-1 ring-gray-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221268.51465223034!2d31.1303254580468!3d29.932997672202657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296ef308332!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1714264620000!5m2!1sen!2seg" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
         </div>
      </section>
    </div>
  );
}
