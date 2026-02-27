export interface ToolDefinition {
  name: string;
  href: string;
  description: string;
  shortDescription: string;
}

export const tools: ToolDefinition[] = [
  {
    name: "Compress Video",
    href: "/compress-video",
    description: "Reduce video file size without losing quality",
    shortDescription: "Shrink files up to 90%",
  },
  {
    name: "Convert Video",
    href: "/convert-video",
    description: "Convert between MP4 and WebM formats",
    shortDescription: "MP4 ↔ WebM",
  },
  {
    name: "Resize Video",
    href: "/resize-video",
    description: "Change video resolution to 1080p, 720p, or custom",
    shortDescription: "4K → 1080p → 720p → 480p",
  },
  {
    name: "Mute Video",
    href: "/mute-video",
    description: "Remove the audio track from any video file",
    shortDescription: "Instant audio removal",
  },
  {
    name: "Rotate Video",
    href: "/rotate-video",
    description: "Rotate videos 90° clockwise, counterclockwise, or 180°",
    shortDescription: "90° · 180° · 270°",
  },
];
