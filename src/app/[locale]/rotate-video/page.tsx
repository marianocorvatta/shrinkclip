import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ToolPageShell from "@/components/ToolPageShell";
import VideoRotator from "@/components/VideoRotator";
import { buildJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.rotate" });
  const slug = locale === "es" ? "rotar-video" : "rotate-video";

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

export default function RotatePage() {
  const t = useTranslations("toolPages.rotate");
  const tc = useTranslations("rotator");

  const jsonLd = buildJsonLd({
    name: t("jsonLdName"),
    description: t("jsonLdDescription"),
    url: "https://shrinkclip.com/rotate-video",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell title={t("title")} description={t("description")}>
        <VideoRotator
          translations={{
            rotationLabel: tc("rotationLabel"),
            "90cw": tc("90cw"),
            "90ccw": tc("90ccw"),
            "180": tc("180"),
            hint90cw: tc("hint90cw"),
            hint90ccw: tc("hint90ccw"),
            hint180: tc("hint180"),
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
