import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    metadataBase: new URL("https://shrinkclip.com"),
    title: {
      template: "%s | ShrinkClip",
      default: t("title"),
    },
    description: t("description"),
    alternates: {
      canonical: `https://shrinkclip.com/${locale}`,
      languages: {
        en: "https://shrinkclip.com/en/compress-video",
        es: "https://shrinkclip.com/es/comprimir-video",
        "x-default": "https://shrinkclip.com",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          rel="alternate"
          hrefLang="en"
          href="https://shrinkclip.com/en/compress-video"
        />
        <link
          rel="alternate"
          hrefLang="es"
          href="https://shrinkclip.com/es/comprimir-video"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://shrinkclip.com"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-zinc-100 min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
