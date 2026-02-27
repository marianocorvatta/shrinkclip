import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import VideoRotator from "@/components/VideoRotator";
import { buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rotate Video Online Free — 90° or 180°",
  description:
    "Rotate videos 90° clockwise, counterclockwise, or 180°. Free browser-based video rotator — no upload needed, works instantly.",
  keywords: [
    "rotate video",
    "rotate video online",
    "flip video",
    "rotate video 90 degrees",
    "video rotator",
    "rotate mp4 online",
  ],
  alternates: { canonical: "https://shrinkclip.com/rotate-video" },
  openGraph: {
    title: "Rotate Video Online Free | ShrinkClip",
    description:
      "Rotate videos 90° clockwise, counterclockwise, or 180°. No upload required.",
    type: "website",
    url: "https://shrinkclip.com/rotate-video",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate Video Online Free | ShrinkClip",
    description: "Rotate any video 90° or 180° in your browser. No upload needed.",
  },
};

const jsonLd = buildJsonLd({
  name: "ShrinkClip Video Rotator",
  description:
    "Free online video rotator. Rotate videos 90° clockwise, counterclockwise, or 180° directly in your browser.",
  url: "https://shrinkclip.com/rotate-video",
});

export default function RotatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell
        title="Rotate Video Online"
        description="Rotate videos 90° clockwise, counterclockwise, or 180°"
      >
        <VideoRotator />
      </ToolPageShell>
    </>
  );
}
