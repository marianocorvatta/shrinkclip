import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShrinkClip — Free Online Video Compressor",
  description:
    "Compress videos online for free. Reduce video file size without losing quality. Works 100% in your browser, no upload needed. Supports MP4 and WebM.",
  keywords: [
    "video compressor",
    "compress video online",
    "reduce video size",
    "free video compressor",
  ],
  alternates: {
    canonical: "https://shrinkclip.com",
  },
  openGraph: {
    title: "ShrinkClip — Free Online Video Compressor",
    description:
      "Compress videos online for free. Reduce video file size without losing quality. Works 100% in your browser, no upload needed.",
    type: "website",
    url: "https://shrinkclip.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShrinkClip — Free Online Video Compressor",
    description:
      "Compress videos online for free. Reduce video file size without losing quality.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShrinkClip",
  description:
    "Free online video compressor. Compress MP4 and WebM videos directly in your browser with no upload required.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: "https://shrinkclip.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-zinc-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
