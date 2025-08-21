import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import GradientBackdrops from "@/components/GradientBackdrops";
import MobileNav from "@/components/MobileNav";
import LoadingProvider from "@/components/LoadingProvider";
import MatchModalProvider from "@/components/MatchModalProvider";
import { ANDSCORE_BRAND_NAME } from "@/lib/constants";
import FootballTransition from "@/components/FootballTransition";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brand = Sora({
  variable: "--font-brand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "andscore — football, beautifully simple",
  description: "Live scores, fixtures and standings for the top leagues and the Champions League.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "andscore",
    description: "Live scores for the top 5 leagues + UCL",
    type: "website",
  },
  applicationName: ANDSCORE_BRAND_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${brand.variable} antialiased min-h-screen`}>
        <LoadingProvider>
          <MatchModalProvider>
            <FootballTransition />
            <Header />
            <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
              <GradientBackdrops />
              {children}
            </main>
            <Footer />
            <MobileNav />
          </MatchModalProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
