"use client";

import { useEffect, useState, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { 
  Award, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Truck, 
  Lock, 
  Settings,
  Target,
  Eye,
  CheckCircle2,
  Users,
  Calendar,
  Briefcase,
  Clock
} from "lucide-react";

function Counter({ end, suffix = "", duration = 2000 }: { end: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const numericEnd = parseInt(end.replace(/\D/g, ""));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * numericEnd);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, numericEnd, duration]);

  return (
    <div ref={elementRef} className="flex flex-col gap-2">
      <span className="text-4xl md:text-5xl font-extrabold text-[#ff6a00]">
        {end.startsWith("+") ? "+" : ""}{count}{suffix}
      </span>
    </div>
  );
}

export default function AboutPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
        <SafeImage 
          src="/assets/about-hero-italy.png" 
          alt="About GAST Italy" 
          fill 
          className="object-cover"
          priority
        />
        {/* Dark Overlay (30-40%) */}
        <div className="absolute inset-0 bg-brand-blue/35 backdrop-blur-[1px]"></div>
        
        <div className={`relative z-10 max-w-4xl mx-auto text-center px-4 transition-all duration-1000 ease-out transform ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-8 drop-shadow-2xl leading-tight">
            من نصنع الجودة… <br /> <span className="text-[#ff6a00]">نصنع الثقة</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed">
            حلول صناعية متقدمة في عالم المضخات والمواتير، تجمع بين التكنولوجيا الأوروبية والخبرة العميقة.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`relative h-[450px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-1000 transform ${isPageLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}>
             <SafeImage 
              src="/assets/about-italy.png" 
              alt="GAST Italy Headquarters" 
              fill 
              className="object-cover hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/40 to-transparent"></div>
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hidden md:block">
               <p className="text-brand-blue font-bold text-lg mb-1">+10 سنوات</p>
               <p className="text-gray-500 text-sm font-medium">من الريادة الصناعية</p>
            </div>
          </div>
          
          <div className={`space-y-8 transition-all duration-1000 delay-300 transform ${isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
            <div className="inline-block px-5 py-2 bg-orange-50 text-[#ff6a00] rounded-xl text-sm font-bold tracking-wide uppercase border border-orange-100">
              قصة نجاحنا
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-blue leading-[1.2]">
              GAST — تكنولوجيا تحرك <br /> <span className="text-[#ff6a00]">المياه بثقة</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              نحن في GAST نقدم حلول متكاملة للمضخات الصناعية والمنزلية بجودة عالية ومعايير أوروبية، نركز على الأداء، الاعتمادية، والاستدامة في كل منتج نقدمه. 
              نؤمن أن الجودة ليست خياراً، بل هي المحرك الأساسي لكل مسمار ومحرك يخرج من خطوط إنتاجنا.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
               {[
                 "جودة معتمدة عالمياً",
                 "ابتكار تقني مستمر",
                 "استدامة في الأداء",
                 "حلول مخصصة للمشاريع"
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 bg-gray-50/80 px-4 py-3 rounded-xl border border-gray-100 group hover:border-[#ff6a00]/30 transition-colors">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-green-600 w-4 h-4" />
                    </div>
                    <span className="font-bold text-brand-blue text-sm md:text-base">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Section (Why Us) */}
      <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-blue mb-6 tracking-tight">لماذا يختار المحترفون GAST؟</h2>
            <div className="w-24 h-2 bg-[#ff6a00] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Award className="w-10 h-10" />, 
                title: "جودة إيطالية", 
                desc: "نعتمد أرقى المعايير الهندسية الإيطالية في كافة مراحل التصنيع لضمان طول العمر الافتراضي." 
              },
              { 
                icon: <ShieldCheck className="w-10 h-10" />, 
                title: "ضمان حقيقي", 
                desc: "نقدم ضماناً شاملاً يمنحك راحة البال، مع توفر قطع غيار أصلية دائماً." 
              },
              { 
                icon: <Zap className="w-10 h-10" />, 
                title: "أداء عالي", 
                desc: "كفاءة استثنائية في تحويل الطاقة إلى قدرة، مما يقلل من تكاليف التشغيل وزيادة الإنتاجية." 
              },
              { 
                icon: <Headphones className="w-10 h-10" />, 
                title: "دعم فني", 
                desc: "فريق هندسي متخصص متاح على مدار الساعة لتقديم الدعم والتدريب اللازم لمشروعك." 
              },
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-500 text-center flex flex-col items-center group">
                <div className="mb-8 p-5 bg-brand-blue/5 rounded-3xl text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 transform group-hover:rotate-[10deg]">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-blue mb-4">{card.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <Counter end="+5000" suffix="" />
              <div className="flex items-center justify-center gap-2 text-gray-300 font-bold text-lg">
                <Users className="w-5 h-5" />
                <span>عميل سعيد</span>
              </div>
            </div>
            <div className="space-y-2">
              <Counter end="+10" suffix="" />
              <div className="flex items-center justify-center gap-2 text-gray-300 font-bold text-lg">
                <Calendar className="w-5 h-5" />
                <span>سنوات خبرة</span>
              </div>
            </div>
            <div className="space-y-2">
              <Counter end="+100" suffix="" />
              <div className="flex items-center justify-center gap-2 text-gray-300 font-bold text-lg">
                <Briefcase className="w-5 h-5" />
                <span>مشروع صناعي</span>
              </div>
            </div>
            <div className="space-y-2">
              <Counter end="24/7" suffix="" />
              <div className="flex items-center justify-center gap-2 text-gray-300 font-bold text-lg">
                <Clock className="w-5 h-5" />
                <span>دعم فني</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#f1f5f9] p-12 rounded-[3rem] border border-slate-200 space-y-8 relative overflow-hidden group">
            <Target className="absolute -right-16 -bottom-16 w-64 h-64 text-brand-blue/5 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            <div className="w-16 h-16 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Target className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-brand-blue mb-4">رسالتنا</h3>
              <p className="text-xl text-slate-600 font-medium leading-relaxed relative z-10">
                تقديم حلول قوية وموثوقة لتحريك المياه في القطاعات الصناعية والزراعية والمنزلية، من خلال منتجات تجمع بين الكفاءة العالية والاستهلاك الذكي للطاقة، مع الالتزام التام بمعايير الاستدامة البيئية.
              </p>
            </div>
          </div>
          
          <div className="bg-[#fff7ed] p-12 rounded-[3rem] border border-orange-100 space-y-8 relative overflow-hidden group">
            <Eye className="absolute -right-16 -bottom-16 w-64 h-64 text-[#ff6a00]/5 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            <div className="w-16 h-16 bg-[#ff6a00] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Eye className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-brand-blue mb-4">رؤيتنا</h3>
              <p className="text-xl text-slate-600 font-medium leading-relaxed relative z-10">
                أن نكون الخيار الأول والاسم الأكثر ثقة في تكنولوجيا تحريك المياه على مستوى الشرق الأوسط، من خلال الابتكار المستمر والتوسع في إنتاج معدات ذكية تساهم في بناء مستقبل صناعي أفضل.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-wrap justify-center gap-12 md:gap-32">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-brand-blue/5 transition-colors">
                  <Truck className="w-8 h-8 text-brand-blue" />
                </div>
                <span className="font-extrabold text-brand-blue text-lg">شحن سريع وآمن</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-brand-blue/5 transition-colors">
                  <Lock className="w-8 h-8 text-brand-blue" />
                </div>
                <span className="font-extrabold text-brand-blue text-lg">دفع إلكتروني مشفر</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-brand-blue/5 transition-colors">
                  <Settings className="w-8 h-8 text-brand-blue" />
                </div>
                <span className="font-extrabold text-brand-blue text-lg">ضمان فني معتمد</span>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto bg-brand-blue rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff6a00]/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-3xl md:text-6xl font-bold text-white leading-tight">ابدأ مشروعك الصناعي <br /> <span className="text-[#ff6a00]">بثقة مع GAST</span></h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              انضم إلى آلاف العملاء الذين وثقوا بنا في مشاريعهم. اكتشف مجموعتنا الواسعة من المضخات والمحركات الآن.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/shop" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 bg-[#ff6a00] hover:bg-[#e65c00] text-white text-xl font-bold rounded-2xl shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 group"
              >
                استكشف المنتجات
                <Zap className="mr-3 w-6 h-6 group-hover:animate-pulse" />
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 bg-white/10 hover:bg-white/20 text-white text-xl font-bold rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
