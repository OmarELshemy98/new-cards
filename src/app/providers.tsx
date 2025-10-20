/**
 * ما هي لازمة هذا الملف؟
 * 
 * ببساطة، ملف providers.tsx ده معمول لأنه بيلف كل صفحات ومكوّنات التطبيق (children)
 * بـ <AuthProvider>، واللي هو Context مسؤول عن إدارة حالة تسجيل الدخول (Authentication State)
 * في الابلكيشن. 
 * 
 * يعني بدل ما تحط AuthProvider حوالين كل صفحة أو كل مكوّن بنفسك،
 * الملف ده بيعملها مرة واحدة في مكان واحد بس (في الـ root layout)،
 * وكل الصفحات تلقائيًا تقدر تستخدم useAuth وتعرف حالة المستخدم (مسجّل دخول ولا لأ).
 * 
 * كمان لازم يبقى "use client" فوق، لأنه الـ AuthProvider جوّه بيستخدم useState/useEffect
 * (فلازم الكود يتنفذ على جانب العميل وليس السيرفر).
 * 
 * ملخص سريع:
 * - يخلّي State الأوثنتيكيشن متاح في كل مكان في التطبيق بسهولة.
 * - يأكّد أن أي حد يستخدم useAuth يلاقي الداتا الجاهزة.
 * - بيخلّصك من تكرار لف الـ AuthProvider حوالين كل كومبوننت/صفحة.
 */

"use client"; // ضروري علشان الكود ده بيتنفذ على جانب العميل

import { AuthProvider } from "@/hooks/useAuth";

// كومبوننت صغير: بياخد كل الأطفال children 
// ويرجعهم جوا <AuthProvider> علشان يوفر Context الأوث
export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
