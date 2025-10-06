import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shira's Cakes - Custom Cakes & Baking Workshops | Dallas-Fort Worth & Austin",
  description: "Professional custom cake design, cupcakes, cookies, and baking workshops by Shira Tzur. Serving Dallas-Fort Worth and Austin areas. 10% of profits donated to those in need.",
  keywords: "custom cakes, cupcakes, cookies, baking workshops, Dallas, Fort Worth, Austin, cake design, Shira's Cakes",
  authors: [{ name: "Shira Tzur" }],
  openGraph: {
    title: "Shira's Cakes - Custom Cakes & Baking Workshops",
    description: "Professional custom cake design and baking workshops serving Dallas-Fort Worth and Austin areas.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Shira's Cakes Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shira's Cakes - Custom Cakes & Baking Workshops",
    description: "Professional custom cake design and baking workshops serving Dallas-Fort Worth and Austin areas.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
