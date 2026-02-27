import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ToolPageShell from "@/components/ToolPageShell";
import VideoResizer from "@/components/VideoResizer";
import { buildJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.resize" });
  const slug = locale === "es" ? "redimensionar-video" : "resize-video";

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

export default function ResizePage() {
  const t = useTranslations("toolPages.resize");
  const tc = useTranslations("resizer");

  const jsonLd = buildJsonLd({
    name: t("jsonLdName"),
    description: t("jsonLdDescription"),
    url: "https://shrinkclip.com/resize-video",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell title={t("title")} description={t("description")}>
        <VideoResizer
          translations={{
            resolutionLabel: tc("resolutionLabel"),
            custom: tc("custom"),
            customWidthLabel: tc("customWidthLabel"),
            customPlaceholder: tc("customPlaceholder"),
            customError: tc("customError"),
            customHint: tc("customHint"),
            actionButton: tc("actionButton"),
            loadingText: tc("loadingText"),
            progressLabel: tc("progressLabel"),
            progressHint: tc("progressHint"),
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
