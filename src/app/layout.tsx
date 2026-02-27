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
  metadataBase: new URL("https://shrinkclip.com"),
  title: {
    template: "%s | ShrinkClip",
    default: "ShrinkClip — Free Online Video Tools",
  },
  description:
    "Free browser-based video tools. Compress, convert, resize, mute, and rotate videos. No upload needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-zinc-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
