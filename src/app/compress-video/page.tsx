import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import VideoCompressor from "@/components/VideoCompressor";
import { buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compress Video Online Free",
  description:
    "Reduce video file size without losing quality. Compress MP4 and WebM videos in your browser. No upload required — 100% private.",
  keywords: [
    "video compressor",
    "compress video online",
    "reduce video size",
    "free video compressor",
    "compress mp4",
    "compress webm",
  ],
  alternates: { canonical: "https://shrinkclip.com/compress-video" },
  openGraph: {
    title: "Compress Video Online Free | ShrinkClip",
    description:
      "Reduce video file size without losing quality. 100% browser-based, no upload required.",
    type: "website",
    url: "https://shrinkclip.com/compress-video",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Video Online Free | ShrinkClip",
    description: "Reduce video file size without losing quality.",
  },
};

const jsonLd = buildJsonLd({
  name: "ShrinkClip Video Compressor",
  description:
    "Free online video compressor. Reduce file size without losing quality, directly in your browser.",
  url: "https://shrinkclip.com/compress-video",
});

export default function CompressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell
        title="Compress Video Online"
        description="Reduce video file size without losing quality"
      >
        <VideoCompressor />
      </ToolPageShell>
    </>
  );
}
