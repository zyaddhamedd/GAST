import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Toaster } from 'react-hot-toast';

// Optimize Font loading
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1130",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://gast-water.com"),
  title: "GAST - Holmen | مضخات مياه بتكنولوجيا إيطالية",
  description: "اكتشف مجموعة مضخات هولمن (HOLMEN) بتكنولوجيا إيطالية أصلية. حلول ضخ مياه متكاملة للمنازل والمزارع والمشاريع الصناعية بضمان 5 سنوات.",
  keywords: ["مضخات مياه", "هولمن", "مضخات إيطالية", "GAST", "طلمبات مياه", "مواتير مياه"],
  authors: [{ name: "GAST Technology" }],
  openGraph: {
    title: "GAST - Holmen | تكنولوجيا إيطالية تُحرّك المياه",
    description: "أقوى مضخات المياه في مصر بتكنولوجيا إيطالية وضمان 5 سنوات.",
    url: "https://gast-water.com",
    siteName: "GAST - Holmen",
    locale: "ar_EG",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GAST - Holmen | مضخات مياه بتكنولوجيا إيطالية",
    description: "أقوى مضخات المياه في مصر بتكنولوجيا إيطالية وضمان 5 سنوات.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#f9fafb] selection:bg-brand-blue selection:text-white">
        <Header />
        <CustomCursor />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
