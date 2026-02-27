import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import VideoConverter from "@/components/VideoConverter";
import { buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Convert Video Online Free — MP4, WebM",
  description:
    "Convert videos between MP4 and WebM formats for free. Browser-based video converter — no upload required, 100% private.",
  keywords: [
    "video converter",
    "convert video online",
    "mp4 to webm",
    "webm to mp4",
    "free video converter",
    "convert mp4",
  ],
  alternates: { canonical: "https://shrinkclip.com/convert-video" },
  openGraph: {
    title: "Convert Video Online Free — MP4, WebM | ShrinkClip",
    description:
      "Convert videos between MP4 and WebM formats. Browser-based, no upload required.",
    type: "website",
    url: "https://shrinkclip.com/convert-video",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Video Online Free | ShrinkClip",
    description: "Convert MP4 to WebM and WebM to MP4. No upload required.",
  },
};

const jsonLd = buildJsonLd({
  name: "ShrinkClip Video Converter",
  description:
    "Free online video format converter. Convert between MP4 and WebM directly in your browser.",
  url: "https://shrinkclip.com/convert-video",
});

export default function ConvertPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell
        title="Convert Video Online"
        description="Convert between MP4 and WebM formats instantly"
      >
        <VideoConverter />
      </ToolPageShell>
    </>
  );
}
