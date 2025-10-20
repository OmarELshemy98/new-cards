// ده الكود بتاع ال sidemenu الموجوده ف الجمب 
"use client"; 
import { useState, useMemo } from "react";                       // نستورد هوكس React للتحكم في الستيت (useState) وتحسين الاداء (useMemo)
import { usePathname, useRouter } from "next/navigation";         // هوكس من Next.js للوصول للمسار الحالي والراوتر
import Link from "next/link";                                     // عشان نعمل روابط تنقل بين الصفحات بدون ريفريش
import { useAuth } from "@/hooks/useAuth";                        // هوك مخصص للاستعلام عن حالة المستخدم (مين اللي دخل)
import { signOut } from "firebase/auth";                          // دالة تسجيل الخروج من Firebase Auth
import { auth } from "@/firebaseConfig";                          // إعدادات الفايربيز

export default function AppShell({ children }: { children: React.ReactNode }) {
  // اخذنا من هوك الأوث: المستخدم الحالي ولو أدمن ولا لا
  const { user, isAdmin } = useAuth();

  // المسار الحالي في الموقع (مثلا: /dashboard)
  const pathname = usePathname();

  // الراوتر، علشان نعمل تحويل للصفحات
  const router = useRouter();

  // حالة فتح السايدبار في الموبايل (true/false)
  const [open, setOpen] = useState(false);

  // لو على صفحة اللوجين، نخفي السايدبار
  const hideSidebar = pathname?.startsWith("/login");

  // قائمة الروابط الجانبية (Dashboard, Users, Business Cards)
  // لو الادمن بس يشوف لينك "Users"
  const nav = useMemo(
    () =>
      [
        { label: "Dashboard", href: "/dashboard", adminOnly: false }, // يظهر للكل
        { label: "Users", href: "/users", adminOnly: true },         // يظهر للأدمن فقط
        { label: "Business Cards", href: "/business-cards", adminOnly: false }, // يظهر للكل (وضح انه كان فيه خطأ مطبعي في الكود الاصلي buisness-cards عدلناها)
      ] as const,
    []
  );

  // عند الضغط على زرار Logout 
  async function onLogout() {
    await signOut(auth);                  // تسجيل خروج من فايربيز
    router.replace("/login");             // تحويل على صفحة اللوجين
  }

  // لو بنخفي السايدبار (يعني احنا في /login) نعرض بس الأطفال (المحتوى اللي جاي)
  if (hideSidebar) return <>{children}</>;

  // لو مش في صفحة اللوجين: نعرض الهيكل كامل (سايدبار + محتوى + زر المينيو)
  return (
    <div className="min-h-dvh">
      {/* زر فتح السايدبار في الموبايل */}
      <button
        onClick={() => setOpen(s => !s)}                                       // عند الضغط يقلب حالة الفتح/الغلق
        className="md:hidden fixed top-3 left-3 z-50 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm"
        aria-expanded={open}
        aria-controls="sidebar"
      >
        Menu
      </button>

      {/* السايدبار (الشريط الجانبي) */}
      <aside
        id="sidebar"
        className={[
          "fixed z-40 top-0 left-0 h-full w-64",                  // موقعه وحجمه
          "border-r border-white/10 bg-slate-900/70 backdrop-blur", // شكله والالوان
          "transition-transform duration-200",                      // انيمشن للفتح والغلق
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0", // مخفي ولا ظاهر حسب الحالة والمقاس
        ].join(" ")}
      >
        {/* مربع الترحيب وأيميل المستخدم */}
        <div className="p-4 border-b border-white/10">
          <div className="text-xs uppercase tracking-wide text-white/60">Welcome</div>
          <div className="mt-1 font-medium text-white/90 truncate">
            {user?.email ?? "Guest"}               {/* يظهر الايميل لو موجود، لو لا يكتب Guest */}
          </div>
        </div>

        {/* قائمة الروابط */}
        <nav className="p-3 space-y-1">
          {nav.map(item => {
            if (item.adminOnly && !isAdmin) return null;      // لو اللينك ادمن بس والمستخدم مش ادمن: مخفي
            const active = pathname === item.href;            // هل ده هو الرابط الحالي (مفعل)؟
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-cyan-400/20 border border-cyan-300/25" // لو هو الحالي لونه مختلف
                    : "border border-transparent hover:border-white/10 hover:bg-white/5", // الافتراضي
                ].join(" ")}
                onClick={() => setOpen(false)}                // لما اضغط اقفل السايدبار (في الموبايل)
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* زرار الخروج (Logout) تحت السايدبار */}
        <div className="mt-auto absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* هنا مكان المحتوى الاساسي للتطبيق */}
      <main className="md:ml-64 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}

