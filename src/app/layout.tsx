import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css"; // 👈 هنا الإضافة المهمة
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Cards",
  description: "Simple list of business cards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
