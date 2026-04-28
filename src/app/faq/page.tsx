"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, HelpCircle, Settings, ShieldCheck, ShoppingCart, Wrench } from "lucide-react";

const faqData = [
  {
    id: "products",
    title: "معلومات عن المنتجات",
    icon: <HelpCircle className="w-5 h-5" />,
    questions: [
      { q: "هل مضخات هولمن معزولة ضد الصدأ؟", a: "نعم، مصنوعة بخامات مقاومة للصدأ لضمان عمر أطول وأداء ثابت." },
      { q: "ما المواد المستخدمة في تصنيع جسم المضخة؟", a: "يتم استخدام الزهر أو الاستانلس حسب نوع الموديل لضمان المتانة." },
      { q: "هل يمكن تشغيل مضخة هولمن مع خزان علوي أو بدون خزان؟", a: "يمكن تشغيلها في الحالتين حسب نظام المياه لديك." },
      { q: "هل يوجد فرق بين موديلات هولمن المختلفة؟", a: "نعم، تختلف حسب القدرة والاستخدام سواء منزلي أو صناعي." },
      { q: "هل مضخات هولمن مناسبة للاستخدام المنزلي؟", a: "نعم، يوجد موديلات مخصصة للمنازل بسهولة تشغيل عالية." },
      { q: "ما المدى العمري المتوقع لمضخات هولمن؟", a: "عمر افتراضي طويل مع الاستخدام الصحيح والصيانة البسيطة." },
      { q: "هل يوجد فرق بين الغاطس وطلمبات الأعماق؟", a: "نعم، الغاطس يعمل داخل المياه، والأعماق مخصصة للآبار العميقة." },
      { q: "هل تحمل مضخات هولمن شهادات جودة دولية؟", a: "نعم، مطابقة لمعايير الجودة الأوروبية." },
      { q: "هل يتم تصنيع منتجات هولمن بالكامل في ألمانيا؟", a: "يتم تصنيعها وفق تكنولوجيا ومعايير ألمانية عالية." },
      { q: "هل تأتي مضخات هولمن مع لوحة تحكم (كنترول)؟", a: "بعض الموديلات تدعم ذلك حسب الاستخدام." },
      { q: "هل توفر هولمن مضخات مياه سطحية وغاطسة؟", a: "نعم، نوفر جميع الأنواع لتغطية كل الاحتياجات." },
    ],
  },
  {
    id: "maintenance",
    title: "الصيانة والأعطال",
    icon: <Wrench className="w-5 h-5" />,
    questions: [
      { q: "هل تتوفر قطع غيار أصلية بعد الشراء؟", a: "نعم، متوفرة بسهولة لضمان استمرارية التشغيل." },
      { q: "هل صوت المضخة عالي بطبيعتها؟", a: "لا، مصممة لتعمل بكفاءة مع أقل ضوضاء ممكنة." },
      { q: "هل ممكن المضخة تحترق لو اشتغلت من غير مياه؟", a: "نعم، لذلك يُفضل استخدام وسائل حماية ضد التشغيل الجاف." },
      { q: "هل تحتاج مضخة هولمن لصيانة مستمرة؟", a: "لا، فقط صيانة دورية بسيطة للحفاظ على الأداء." },
    ],
  },
  {
    id: "choosing",
    title: "اختيار المضخة المناسبة",
    icon: <Settings className="w-5 h-5" />,
    questions: [
      { q: "كيف أعرف أي مضخة مناسبة لاحتياجي؟", a: "يعتمد على الاستخدام، الارتفاع، ومعدل تدفق المياه." },
      { q: "هل يمكن تشغيل المضخة على كهرباء ضعيفة؟", a: "يُفضل استخدام مصدر كهرباء مستقر لضمان الأداء." },
      { q: "ما الفرق بين مضخة 1 حصان و 2 حصان؟", a: "الفرق في القدرة على رفع المياه والمسافة والضغط." },
      { q: "ما الفرق الحقيقي بين هولمن والأنواع التقليدية؟", a: "جودة أعلى، عمر أطول، وأداء أكثر استقرارًا." },
      { q: "كم مدة الضمان وما الذي يشمله؟", a: "ضمان يصل إلى 5 سنوات ضد عيوب الصناعة." },
      { q: "هل تتوفر قطع غير أصلية بعد الشراء؟", a: "نوصي دائمًا باستخدام قطع أصلية فقط." },
      { q: "هل الأسعار مناسبة مقابل الجودة؟", a: "نعم، تقدم أفضل قيمة مقابل الأداء والجودة." },
      { q: "هل يمكنني استشارة فريق هولمن قبل الشراء؟", a: "بالتأكيد، فريق الدعم متاح لمساعدتك." },
    ],
  },
  {
    id: "warranty",
    title: "الضمان والدعم الفني",
    icon: <ShieldCheck className="w-5 h-5" />,
    questions: [
      { q: "ما مدة الضمان؟", a: "حتى 5 سنوات حسب المنتج." },
      { q: "ماذا يشمل الضمان؟", a: "يغطي عيوب الصناعة فقط." },
      { q: "كيف أتواصل مع الدعم الفني؟", a: "من خلال الهاتف أو واتساب بسهولة." },
    ],
  },
  {
    id: "purchase",
    title: "الشراء والشحن",
    icon: <ShoppingCart className="w-5 h-5" />,
    questions: [
      { q: "هل يوجد توصيل للمنازل؟", a: "نعم، نوفر خدمة توصيل سريعة." },
      { q: "هل تتوفر طرق دفع متعددة؟", a: "نعم، منها الدفع عند الاستلام." },
      { q: "هل يمكن استرجاع المنتج؟", a: "متاح وفق سياسة الاسترجاع." },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(faqData[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(0);
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[35vh] md:h-[45vh] min-h-[300px] md:min-h-[350px] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="/assets/اسئله شائعه.png" 
          alt="FAQ Banner" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-blue/30 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-7xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-2xl">
            الأسئلة الشائعة
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 font-medium max-w-2xl mx-auto drop-shadow-xl leading-relaxed">
            كل ما تحتاج معرفته قبل الشراء في مكان واحد
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Categories Navigation (Desktop Sidebar / Mobile Horizontal Scroll) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 w-full overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex lg:flex-col bg-gray-50 md:bg-gray-50/50 p-2 md:p-4 rounded-2xl md:rounded-[2rem] border border-gray-100 min-w-max lg:min-w-0">
              <h3 className="hidden lg:block text-xl font-bold text-brand-blue mb-6 pr-4 border-r-4 border-[#ff6a00]">
                تصفح حسب القسم
              </h3>
              <div className="flex lg:flex-col gap-2 w-full">
                {faqData.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-right font-bold transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
                      activeCategory === cat.id
                        ? "bg-white text-[#ff6a00] shadow-md ring-1 ring-orange-100 lg:translate-x-[-4px]"
                        : "text-gray-500 hover:bg-white hover:text-brand-blue hover:shadow-sm"
                    }`}
                  >
                    <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-colors ${activeCategory === cat.id ? "bg-[#ff6a00] text-white" : "bg-white text-gray-400 shadow-sm"}`}>
                      {cat.icon}
                    </div>
                    <span className="text-sm md:text-lg">{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-8 min-h-[400px] md:min-h-[600px] w-full">
            <div className="space-y-4 md:space-y-5">
              {faqData.find(c => c.id === activeCategory)?.questions.map((item, index) => (
                <div 
                  key={index} 
                  className={`group bg-white border border-gray-100 rounded-2xl md:rounded-[1.5rem] overflow-hidden transition-all duration-500 ${
                    openIndex === index ? "shadow-xl md:shadow-2xl shadow-gray-200/50 ring-1 ring-[#ff6a00]/30" : "hover:shadow-lg hover:border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 md:p-7 text-right outline-none gap-4"
                  >
                    <span className={`text-base md:text-xl font-bold leading-tight md:leading-snug transition-colors ${openIndex === index ? "text-[#ff6a00]" : "text-brand-blue group-hover:text-[#ff6a00]"}`}>
                      {item.q}
                    </span>
                    <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${openIndex === index ? "bg-[#ff6a00] border-[#ff6a00] text-white rotate-180" : "border-gray-200 text-gray-400 group-hover:border-[#ff6a00] group-hover:text-[#ff6a00]"}`}>
                      <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </button>
                  
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="px-5 md:px-7 pb-5 md:pb-7 pt-2 text-sm md:text-lg text-gray-600 font-medium leading-relaxed border-t border-gray-50/50">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Quick Support Section */}
      <section className="py-24 px-4 bg-brand-blue relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">هل لديك استفسار فني خاص؟</h2>
           <p className="text-xl text-gray-300 mb-12 font-medium max-w-2xl mx-auto">
             خبراء هولمن متاحون دائماً لمساعدتك في حساب الضغوط واختيار الموديل الأنسب لمشروعك مجاناً.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="https://wa.me/..." className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25d366] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-[#25d366]/20">
                تحدث مع خبير على واتساب
              </a>
              <a href="tel:..." className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-brand-blue px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
                اتصل بنا مباشرة
              </a>
           </div>
        </div>
      </section>
    </div>
  );
}
