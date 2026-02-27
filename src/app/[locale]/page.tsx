import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ToolCard from "@/components/ToolCard";
import Footer from "@/components/Footer";
import PrivacyBadge from "@/components/PrivacyBadge";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const toolEntries = [
  { key: "compress", href: "/compress-video" as const },
  { key: "convert", href: "/convert-video" as const },
  { key: "resize", href: "/resize-video" as const },
  { key: "mute", href: "/mute-video" as const },
  { key: "rotate", href: "/rotate-video" as const },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    alternates: { canonical: `https://shrinkclip.com/${locale}` },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://shrinkclip.com/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logo-w.png"
              alt="ShrinkClip logo"
              width={96}
              height={96}
              className="mx-auto"
              priority
            />
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="text-zinc-300 text-xl mb-2 font-medium">
            {t("hero.subtitle")}
          </p>
          <p className="text-zinc-500 text-base max-w-xl mx-auto">
            {t("hero.description")}
          </p>
        </div>

        <PrivacyBadge />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {toolEntries.map(({ key, href }) => (
            <ToolCard
              key={key}
              name={t(`tools.${key}.name`)}
              href={href}
              description={t(`tools.${key}.description`)}
              shortDescription={t(`tools.${key}.shortDescription`)}
            />
          ))}
        </div>

        <Footer />
      </div>
    </main>
  );
}
