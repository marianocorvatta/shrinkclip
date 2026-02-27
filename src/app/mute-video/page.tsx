import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import VideoMuter from "@/components/VideoMuter";
import { buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Remove Audio from Video Online Free",
  description:
    "Strip audio from any video file instantly. Mute videos in your browser — no upload needed, 100% private and free.",
  keywords: [
    "remove audio from video",
    "mute video",
    "strip audio",
    "video without sound",
    "remove sound from video",
    "mute video online",
  ],
  alternates: { canonical: "https://shrinkclip.com/mute-video" },
  openGraph: {
    title: "Remove Audio from Video Online Free | ShrinkClip",
    description:
      "Strip audio from any video file instantly. No upload required.",
    type: "website",
    url: "https://shrinkclip.com/mute-video",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Audio from Video | ShrinkClip",
    description: "Mute any video instantly in your browser. No upload needed.",
  },
};

const jsonLd = buildJsonLd({
  name: "ShrinkClip Video Muter",
  description:
    "Free online tool to remove audio from video files. Works directly in your browser with no upload required.",
  url: "https://shrinkclip.com/mute-video",
});

export default function MutePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageShell
        title="Remove Audio from Video"
        description="Strip the audio track from any video instantly"
      >
        <VideoMuter />
      </ToolPageShell>
    </>
  );
}
