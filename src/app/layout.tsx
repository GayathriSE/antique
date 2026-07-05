import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jewels Antique — Rare & Exquisite Antique Jewellery",
    template: "%s | Jewels Antique",
  },
  description:
    "Discover rare and exquisite antique jewellery — curated pieces from Mughal, Victorian, and Art Deco eras.",
  keywords: ["antique jewellery", "vintage jewellery", "Kundan", "Polki", "Victorian jewellery", "Mughal jewellery"],
  authors: [{ name: "Jewels Antique" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Jewels Antique",
    title: "Jewels Antique — Rare & Exquisite Antique Jewellery",
    description: "Curated antique jewellery from across the centuries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jewels Antique",
    description: "Discover rare and exquisite antique jewellery.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-stone-900">
        <SessionProvider session={session}>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
