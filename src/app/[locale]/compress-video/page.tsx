import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ToolPageShell from "@/components/ToolPageShell";
import VideoCompressor from "@/components/VideoCompressor";
import { buildJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.compress" });
  const slug = locale === "es" ? "comprimir-video" : "compress-video";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    alternates: {
      canonical: `https://shrinkclip.com/${locale}/${slug}`,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      url: `https://shrinkclip.com/${locale}/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("twitterDescription"),
    },
  };
}

export default function CompressPage() {
  const t = useTranslations("toolPages.compress");

  const jsonLd = buildJsonLd({
    name: t("jsonLdName"),
    description: t("jsonLdDescription"),
    url: "https://shrinkclip.com/compress-video",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell title={t("title")} description={t("description")}>
        <VideoCompressor />
      </ToolPageShell>
    </>
  );
}
