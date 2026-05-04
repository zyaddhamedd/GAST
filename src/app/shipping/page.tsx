import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-right" dir="rtl">
        <h1 className="text-4xl font-black text-brand-blue mb-8">سياسة الشحن والاسترجاع</h1>
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p>نسعى في GAST لتقديم تجربة تسوق سلسة وموثوقة لجميع عملائنا في مصر.</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-10">الشحن والتوصيل</h2>
          <p>يتم توصيل الطلبات خلال 2-5 أيام عمل لجميع المحافظات. نقدم شحناً مجانياً على العروض المحددة.</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-10">سياسة الاسترجاع</h2>
          <p>يمكنكم استرجاع أو استبدال المنتجات خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية وبتغليفه الأصلي.</p>
          <p className="mt-12">للطلبات والاستفسارات، يرجى التواصل مع خدمة العملاء عبر الواتساب.</p>
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
