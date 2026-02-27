import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ToolPageShell from "@/components/ToolPageShell";
import VideoConverter from "@/components/VideoConverter";
import { buildJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.convert" });
  const slug = locale === "es" ? "convertir-video" : "convert-video";

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

export default function ConvertPage() {
  const t = useTranslations("toolPages.convert");
  const tc = useTranslations("converter");

  const jsonLd = buildJsonLd({
    name: t("jsonLdName"),
    description: t("jsonLdDescription"),
    url: "https://shrinkclip.com/convert-video",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell title={t("title")} description={t("description")}>
        <VideoConverter
          translations={{
            formatLabel: tc("formatLabel"),
            webmHint: tc("webmHint"),
            actionButton: tc("actionButton"),
            loadingText: tc("loadingText"),
            progressLabel: tc("progressLabel"),
            progressHintWebm: tc("progressHintWebm"),
            outputLabel: tc("outputLabel"),
            successMessage: tc("successMessage"),
            downloadLabel: tc("downloadLabel"),
            resetButton: tc("resetButton"),
          }}
        />
      </ToolPageShell>
    </>
  );
}
