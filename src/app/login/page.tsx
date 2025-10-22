/**
 * صفحة تسجيل الدخول (Client Component) فيها فورم Email/Password،
 * بتستعمل useAuth.login، وبتحوّل ل"/" لو المستخدم بالفعل لوجين.
 * فيها شوية أنيميشن/ستايل لطيفة بـ Tailwind و keyframes.
 */

"use client"; // لازم عميل علشان state/effect والتنقّل

import { useEffect, useState, FormEvent } from "react"; // state/effect وأنواع للفورم
import { useRouter } from "next/navigation";            // راوتر App Router
import { useAuth } from "@/hooks/useAuth";              // هوك الأوث بتاعنا

// Utility for animating box shadow pulsate
// سترينج كلاسز جاهز هنستخدمه على بوكس معين علشان يعمل نبض ظل
const pulseBoxShadow =
  "animate-[shadowPulse_2.8s_ease-in-out_infinite]";

export default function LoginPage() {
  const router = useRouter();           // نجيب الراوتر علشان نعمل redirect
  const { user, login, register } = useAuth();    // من الأوث: المستخدم الحالي + دالة اللوجين + التسجيل

  // ستايتس للفورم/الـ UI
  const [email, setEmail] = useState("");           // قيمة الإيميل
  const [password, setPassword] = useState("");     // قيمة الباسورد
  const [showPass, setShowPass] = useState(false);  // إظهار/إخفاء الباسورد
  const [loadingBtn, setLoadingBtn] = useState(false); // حالة زرار “جارٍ”
  const [error, setError] = useState<string | null>(null); // رسالة خطأ
  const [mounted, setMounted] = useState(false);    // للأنيميشن عند الدخول

  useEffect(() => setMounted(true), []); // أول ما الصفحة تركب، خلّي mounted=true (يفعّل ترانزيشن دخول)

  useEffect(() => {
    if (user) router.replace("/");      // لو المستخدم موجود بالفعل، حوّله للصفحة الرئيسية
  }, [user, router]);                   // التابع يتنفّذ كل ما user يتغيّر

  // هاندل سبميت الفورم
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();            // امنع الريفريش الافتراضي
    setError(null);                // امسح أي خطأ قديم
    setLoadingBtn(true);           // فعل حالة التحميل للزرار
    try {
      await login(email, password); // جرّب تسجّل الدخول
      // لو نجحت، onAuthStateChanged هيتكفّل بالباقي (والـ useEffect فوق هيحوّل لـ "/")
    } catch (e) {
      // مسكنا الخطأ: نحوّله لرسالة مفهومة
      const msg = (e as Error)?.message ?? "Login failed";
      setError(
        msg.includes("invalid") || msg.includes("wrong")
          ? "Invalid email or password."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoadingBtn(false); // في كل الحالات: بطّل التحميل
    }
  };

  // تسجيل حساب جديد
  const onRegister = async () => {
    setError(null);
    setLoadingBtn(true);
    try {
      await register(email, password);
      // بعد التسجيل، هيتم تسجيل الدخول تلقائياً من Firebase
    } catch (e) {
      const msg = (e as Error)?.message ?? "Registration failed";
      setError(
        msg.includes("email") && msg.includes("already")
          ? "Email already in use."
          : "Could not register. Please try again."
      );
    } finally {
      setLoadingBtn(false);
    }
  };

  if (user) return null; // لو المستخدم موجود بالفعل، منعرضش الصفحة (الراوتر هيعيد توجيه)

  return (
    // الحاوية الأساسية: سنتر عمودي/أفقي + جراديانت خلفية + أوڤر فلو مخفي علشان البلوبز
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-tr from-[#10172a] via-[#18172f] to-[#1a173a] relative overflow-hidden">
      {/* بلوب جراديانت متحرك فوق الشمال — للزينة */}
      <span
        aria-hidden
        className="absolute left-0 top-0 -translate-x-2/3 -translate-y-1/3 w-[500px] h-[340px] rounded-full blur-[120px] z-0 bg-gradient-to-br from-cyan-400/30 to-fuchsia-400/20 animate-blob1"
      ></span>
      {/* بلوب جراديانت متحرك تحت اليمين — للزينة */}
      <span
        aria-hidden
        className="absolute right-0 bottom-0 translate-x-2/4 translate-y-2/4 w-[380px] h-[230px] rounded-full blur-[80px] z-0 bg-gradient-to-tr from-violet-400/30 to-cyan-400/10 animate-blob2"
      ></span>

      {/* الكارد نفسه: بنعمل ترانزيشن دخول حسب mounted */}
      <div
        className={[
          "relative mx-auto w-full max-w-sm sm:max-w-md z-10 transition-all duration-700",
          mounted
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
        ].join(" ")}
      >
        {/* طبقة مشعة خلف الكارد (Glow) مع أنيميشن ظل نبضي */}
        <div
          aria-hidden
          className={[
            "absolute inset-0 z-0 rounded-3xl pointer-events-none",
            "bg-gradient-to-tr from-cyan-400/70 via-fuchsia-400/80 to-cyan-200/60",
            "blur-md opacity-30",
            pulseBoxShadow,
          ].join(" ")}
          style={{ filter: "blur(18px)" }}
        />

        {/* محتوى الكارد */}
        <div className="relative z-10 rounded-3xl bg-white/10 border border-white/15 shadow-xl backdrop-blur-lg p-8 flex flex-col gap-6">
          {/* هيدر بسيط: لوجو + عناوين */}
          <div className="flex items-center gap-3">
            <Logo size={28} /> {/* أيقونة لوجو (SVG تحت) */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-cyan-200 drop-shadow">
                Welcome back
              </h1>
              <p className="text-xs mt-0.5 text-white/60">
                Sign in to your Cards dashboard
              </p>
            </div>
          </div>

          {/* لو فيه خطأ نعرضه في Alert ستايل */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 mb-2 rounded-lg border border-red-500/30 bg-red-400/10 px-4 py-2 text-sm text-red-200 animate-fade-in"
            >
              {/* أيقونة تنبيه صغيرة */}
              <svg width={18} height={18} viewBox="0 0 24 24" className="text-red-300" fill="currentColor" aria-hidden>
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              {error}
            </div>
          )}

          {/* فورم اللوجين */}
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-5">
            {/* حقل الإيميل */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/85 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)} // نحدّث state بالإيميل
                className="w-full rounded-lg border border-cyan-300/20 bg-cyan-900/20 px-4 py-2.5 text-white placeholder-cyan-200/30 outline-none shadow-inner transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30"
                placeholder="name@example.com"
              />
            </div>

            {/* حقل الباسورد + زرار show/hide */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/85 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}   // بدّل النوع حسب showPass
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)} // نحدّث state بالباسورد
                  className="w-full rounded-lg border border-cyan-300/20 bg-cyan-900/20 px-4 py-2.5 pr-12 text-white placeholder-cyan-200/30 outline-none shadow-inner transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30"
                  placeholder="••••••••"
                />
                {/* زرار إظهار/إخفاء الباسورد */}
                <button
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  aria-pressed={showPass}
                  onClick={() => setShowPass(s => !s)} // نقلب القيمة
                  tabIndex={0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-cyan-200/70 bg-cyan-800/20 hover:bg-cyan-800/40 hover:text-cyan-100 focus:outline-cyan-600 transition"
                >
                  {/* أيقونة عين/عين متشطّبة — (SVG paths) */}
                  {showPass ? (
                    <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24"><path d="M12 6c-5 0-9 4-9 6s4 6 9 6 9-4 9-6-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4a4 4 0 1 1 8 0c0 2.21-1.79 4-4 4zm0-7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
                  ) : (
                    <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24"><path d="M12 4a10 10 0 0 0-9 6c.6 1.36 1.56 2.61 2.83 3.63l-1.9 1.9a1 1 0 1 0 1.42 1.42l16-16A1 1 0 1 0 18.6 1.4L16.1 4c-1.25-.46-2.6-.74-4.1-.76zm6.92 2.73a9.94 9.94 0 0 1 2.87 4.27c-1.7 3.09-5.44 6-9.79 6-1.07 0-2.13-.17-3.15-.46l-1.46 1.46A11.96 11.96 0 0 0 12 18c4.35 0 8.09-2.91 9.79-6a9.88 9.88 0 0 0-2.87-4.27z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember/Forgot */}
            <div className="flex items-center justify-between text-xs mt-2">
              <label className="inline-flex items-center gap-2 text-white/65">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-cyan-300/15 bg-cyan-900/40 transition-colors outline-none focus:ring-0"
                  defaultChecked
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert("Need real password reset? I can wire it up for you.") // Placeholder للتجربة
                }
                className="font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition"
                tabIndex={0}
              >
                Forgot password?
              </button>
            </div>

            {/* أزرار Sign in / Register */}
            <button
              type="submit"
              disabled={loadingBtn} // قفّله وقت التحميل
              className={[
                "relative mt-2 group inline-flex w-full items-center justify-center rounded-xl py-3 bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-semibold text-slate-950 text-[1rem] tracking-wide shadow-lg transition-transform duration-150 ease-in-out hover:scale-105 focus:scale-95 active:scale-95",
                "outline-none",
                "hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)]",
                "disabled:cursor-not-allowed disabled:opacity-65",
              ].join(" ")}
            >
              {/* لمعة خفيفة تتحرك عند الـ hover */}
              <span className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-20 bg-white/30 transition duration-300 rounded-xl" />
              <span className="flex items-center gap-2 relative z-10">
                {loadingBtn ? (
                  <>
                    <Spinner /> {/* أيقونة لودينج (SVG) */}
                    Signing in…
                  </>
                ) : (
                  <>
                    <Arrow />   {/* أيقونة سهم (SVG) */}
                    Sign in
                  </>
                )}
              </span>
            </button>

            <button
              type="button"
              disabled={loadingBtn}
              onClick={onRegister}
              className={[
                "relative mt-2 inline-flex w-full items-center justify-center rounded-xl py-3 border border-cyan-300/25 bg-cyan-300/10 font-semibold text-cyan-100 text-[1rem] tracking-wide transition-transform duration-150 ease-in-out hover:scale-[1.02] focus:scale-95 active:scale-95",
                "outline-none",
                "hover:shadow-[0_8px_30px_rgba(56,189,248,0.08)]",
                "disabled:cursor-not-allowed disabled:opacity-65",
              ].join(" ")}
            >
              {loadingBtn ? "Please wait…" : "Create new account"}
            </button>
          </form>

          {/* فوتر بسيط */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-cyan-100/75">
            <Dot /> {/* نقطة صغيرة (span) كشكل بصري */}
            Secured by Firebase Authentication
          </div>
        </div>
      </div>

      {/* keyframes عالمستوى الجلوبال: shadowPulse/ blob1/ blob2/ fadeIn */}
      <style jsx global>{`
        @keyframes shadowPulse {
          0%,100% { box-shadow: 0 0 32px 8px #67e8f9cc, 0 0 4px 0 #a21cafcc;}
          25% { box-shadow: 0 0 36px 10px #c084facc, 0 0 7px 1px #38bdf8aa;}
          60% { box-shadow: 0 0 28px 6px #38bdf888, 0 0 5px 0 #c084fa99;}
        }
        @keyframes blob1 {
          0%,100% { transform: translate(-66%, -33%) scale(1);}
          60% { transform: translate(-56%, -23%) scale(1.1);}
        }
        @keyframes blob2 {
          0%,100% { transform: translate(50%,50%) scale(1);}
          55% { transform: translate(56%,60%) scale(1.12);}
        }
        .animate-blob1 { animation: blob1 8s ease-in-out infinite; }
        .animate-blob2 { animation: blob2 8s 1.8s ease-in-out infinite;}
        .animate-fade-in { animation: fadeIn .35s;}
        @keyframes fadeIn { from { opacity:0; transform: translateY(-0.5rem);} to {opacity:1;transform:none;} }
      `}</style>
    </div>
  );
}

/* ===== Small UI atoms ===== */

// أيقونة لوجو بسيط (SVG). الخاصية size لتكبير/تصغير.
function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-cyan-300 drop-shadow" fill="currentColor" aria-hidden>
      {/* path بيرسم شكل اللوجو — تفاصيل الرسم مش لوجيك، فبنعدّيها */}
      <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7zm3-1a1 1 0 0 0-1 1v3h4V6H7zm6 0v4h4V7a1 1 0 0 0-1-1h-3zm4 6h-4v4h3a1 1 0 0 0 1-1v-3zm-6 4v-4H6v3a1 1 0 0 0 1 1h3z" />
    </svg>
  );
}

// أيقونة سهم
function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
    </svg>
  );
}

// سبينر تحميل
function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

// نقطة صغيرة للزينة
function Dot() {
  return (
<span className="inline-block h-2 w-2 rounded-full bg-cyan-300 shadow shadow-cyan-200/40" />
  );
}

/**
 * ❓ ايه لازمة الصفحة دي؟
 * - بتديك صفحة لوجين مستقلة شيك/آمنة تقدر تعيد استخدامها في أي مشروع فيوتشر.
 * - بتستعمل نظام الأوث بتاع app (مع تغطية الريديركت الذكي)، وبتديلك تجارب متناسقة ومُحمية.
 * - فورم مصمّم بتايلويند: UI واضح ومتجوّب وسريع متجاوب.
 * - تدعم كمان الـ Animation/الـ Feedback البصري من أول ريفريش لحد تسجيل ناجح أو خطأ بوضوح.
 * - استعملها/اكتب زيها ومش هتندم، لأن كل خطوة فيها مانعة الـ race conditions ومغطية حالات الخطأ/اللودينج كويس.
 */
