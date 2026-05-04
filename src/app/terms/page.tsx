import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-right" dir="rtl">
        <h1 className="text-4xl font-black text-brand-blue mb-8">شروط الخدمة</h1>
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p>مرحباً بكم في GAST. باستخدامكم لموقعنا، فإنكم توافقون على الالتزام بالشروط والأحكام التالية.</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-10">1. استخدام الموقع</h2>
          <p>يُسمح باستخدام هذا الموقع للأغراض المشروعة فقط ووفقاً للقوانين المعمول بها في جمهورية مصر العربية.</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-10">2. الملكية الفكرية</h2>
          <p>جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات، هي ملك لشركة GAST ومحمية بموجب قوانين الملكية الفكرية.</p>
          <p className="mt-12">هذه الصفحة قيد التحديث حالياً. لمزيد من الاستفسارات، يرجى التواصل معنا.</p>
        </div>
        <div className="mt-12">
          <Link href="/" className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
