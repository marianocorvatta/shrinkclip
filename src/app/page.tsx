import dynamic from "next/dynamic";

const VideoCompressor = dynamic(
  () => import("@/components/VideoCompressor"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <VideoCompressor />
    </main>
  );
}
