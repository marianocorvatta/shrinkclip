import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import VideoResizer from "@/components/VideoResizer";
import { buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resize Video Online Free — Change Resolution",
  description:
    "Resize videos to any resolution. Scale down 4K to 1080p, 720p, or 480p. Free browser-based video resizer — no upload needed.",
  keywords: [
    "resize video",
    "change video resolution",
    "downscale video",
    "video resizer online",
    "reduce video resolution",
    "4k to 1080p",
    "1080p to 720p",
  ],
  alternates: { canonical: "https://shrinkclip.com/resize-video" },
  openGraph: {
    title: "Resize Video Online Free | ShrinkClip",
    description:
      "Resize videos to 1080p, 720p, 480p or custom resolution. No upload required.",
    type: "website",
    url: "https://shrinkclip.com/resize-video",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Video Online Free | ShrinkClip",
    description: "Scale down 4K to 1080p, 720p, 480p or any custom resolution.",
  },
};

const jsonLd = buildJsonLd({
  name: "ShrinkClip Video Resizer",
  description:
    "Free online video resizer. Change video resolution to 1080p, 720p, 480p, or any custom size — directly in your browser.",
  url: "https://shrinkclip.com/resize-video",
});

export default function ResizePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell
        title="Resize Video Online"
        description="Change video resolution to 1080p, 720p, 480p or custom"
      >
        <VideoResizer />
      </ToolPageShell>
    </>
  );
}
