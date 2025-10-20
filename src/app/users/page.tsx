/**
 * لازمه الكود ده:
 * - الصفحة دي معمولة عشان تعرض لستة المستخدمين في الـ Admin Panel (مكان مُخصص للأدمن فقط).
 * - الكود بيمنع أي حد مش أدمن (أو مش لوجين) من أنه يشوف الصفحة دي، وبيعمل ريدايركت لو حاول يدخل عليها.
 * - الكومبوننت مربوط بالـ Auth system؛ بيشوف حالة اليوزر والتحميل والتأكد من الصلاحيات.
 * - هو حالياً Placeholder/هيكل فاضي، وهيتم بناء جدول المستخدمين فيه بعدين.
 *
 * شرح سطر سطر:
 */

// تفعيل next.js client (ضروري لاستخدام الـ hooks واعتماد الكومبوننت على الأحداث على الكلاينت)
"use client";

// استيراد هوك الأوث للحصول على بيانات المستخدم الحالي (user/loading/isAdmin)
import { useAuth } from "@/hooks/useAuth";
// استيراد useEffect علشان نقدر ننفذ كود بعد ما الكومبوننت يترندر أو لما الداتا تتغير
import { useEffect } from "react";
// استيراد راوتر النكست للتنقل البرمجي (redirect لو لزم)
import { useRouter } from "next/navigation";

// الكومبوننت الأساسي للصفحة
export default function UsersPage() {
  // نستخرج user (المستخدم الحالي)، loading (جاري التحميل؟)، isAdmin (هل هو أدمن؟) من هوك الأوث
  const { user, loading, isAdmin } = useAuth();
  // نجيب الراوتر من هوك النكست
  const router = useRouter();

  // شغل side effect كل ما يتغير (loading, user, isAdmin, router)
  useEffect(() => {
    // لو التحميل خلص
    if (!loading) {
      // لو مفيش يوزر: اعمل ريدايركت للوجين
      if (!user) router.replace("/login");
      // لو في يوزر لكن مش أدمن: ارجعه للصفحة الرئيسية (حماية زيادة)
      else if (!isAdmin) router.replace("/"); // حماية أكتر
    }
  }, [loading, user, isAdmin, router]);

  // لو لسه بيحمل أو مفيش يوزر أو مش أدمن: اعرض رسالة تحميل ولا تعرض المحتوى
  if (loading || !user || !isAdmin)
    return <p className="p-8 text-center">Loading…</p>;

  // لو عدى الشروط فوق: اعرض المحتوى الأساسي للصفحة (يعني الأدمن فقط)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-white/70 mt-1">Admin-only area</p>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        {/* هنا نضيف جدول المستخدمين لاحقًا */}
        Nothing here yet. Coming soon.
      </div>
    </div>
  );
}
