/**
 * ده الـ Root Layout بتاع تطبيق Next.js (App Router).
 * بيحط الـ HTML الأساسي (html/body)، يفعّل الخط، يضمّن الستايلات العامة،
 * ويلوّف كل الصفحات بـ <Providers> علشان الكونتكست (الأوث) يبقى متاح.
 */

import type { Metadata } from "next"; // بنستورد نوع Metadata علشان نعرّف ميتاداتا للصفحات
import { Geist } from "next/font/google"; // بنستورد فونت Google جاهز بالطريقة الجديدة بتاعة Next
import "./globals.css"; // 👈 هنا الإضافة المهمة: بتفعّل Tailwind + الستايل العام للتطبيق
import Providers from "./providers"; // Wrapper هيمد الصفحات بالـ AuthProvider

// بنكوّن نسخة من الفونت Geist ونحطها في متغيّر CSS علشان نستخدمه في body
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

// ميتاداتا افتراضية لكل الصفحات (العنوان والوصف)
export const metadata: Metadata = {
  title: "Business Cards",
  description: "Simple list of business cards",
};

// RootLayout هو الـ layout الأساسي اللي بيلف كل صفحات app/
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // بنحدد اللغة "en" لصفحة HTML كلها
    <html lang="en">
      {/* body: بنحط فيه متغيّر الخط + antialiased لنعومة النصوص */}
      <body className={`${geistSans.variable} antialiased`}>
        {/* Providers: هنا بنحط AuthProvider حوالين كل الصفحات علشان useAuth تشتغل */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
