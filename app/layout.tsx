import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--app-font-sans",
  display: "swap",
});

const SITE_URL = "https://whatdoesthisreallycost.com";
const SITE_NAME = "What Does This Really Cost";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — The Honest Money Blog`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Discover the true long-term cost of everyday things — cars, subscriptions, lifestyle choices, and more. Interactive calculators and honest breakdowns.",
  keywords: ["cost of living", "personal finance", "true cost", "money", "budget"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — The Honest Money Blog`,
    description:
      "Discover the true long-term cost of everyday things — cars, subscriptions, lifestyle choices, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — The Honest Money Blog`,
    description:
      "Discover the true long-term cost of everyday things — cars, subscriptions, lifestyle choices, and more.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description:
      "Honest breakdowns of the true long-term cost of everyday things",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
