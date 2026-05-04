import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-right" dir="rtl">
        <h1 className="text-4xl font-black text-brand-blue mb-8">سياسة الخصوصية</h1>
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p>في GAST، نولي أهمية كبرى لخصوصية زوارنا وعملائنا. توضح هذه السياسة كيفية جمع واستخدام معلوماتكم الشخصية.</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-10">جمع المعلومات</h2>
          <p>نحن نجمع المعلومات التي تقدمونها لنا عند التسجيل أو الشراء أو التواصل معنا، مثل الاسم ورقم الهاتف والعنوان.</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-10">استخدام المعلومات</h2>
          <p>نستخدم معلوماتكم لتحسين تجربتكم، ومعالجة طلباتكم، والتواصل معكم بخصوص آخر العروض والمنتجات.</p>
          <p className="mt-12">هذه الصفحة قيد التحديث حالياً. نحن نلتزم بحماية بياناتكم وفقاً لأعلى المعايير.</p>
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
