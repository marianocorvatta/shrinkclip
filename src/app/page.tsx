import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import Footer from "@/components/Footer";
import PrivacyBadge from "@/components/PrivacyBadge";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "ShrinkClip — Free Online Video Tools",
  description:
    "Free browser-based video tools. Compress, convert, resize, mute, and rotate videos online. No upload needed — 100% private processing.",
  keywords: [
    "video tools online",
    "compress video",
    "convert video",
    "resize video",
    "free video editor",
    "browser video tools",
  ],
  alternates: { canonical: "https://shrinkclip.com" },
  openGraph: {
    title: "ShrinkClip — Free Online Video Tools",
    description:
      "Compress, convert, resize, mute, and rotate videos directly in your browser. No uploads, no servers.",
    type: "website",
    url: "https://shrinkclip.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShrinkClip — Free Online Video Tools",
    description: "Free browser-based video tools. No upload needed.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logo-w.png"
              alt="ShrinkClip logo"
              width={96}
              height={96}
              className="mx-auto"
              priority
            />
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            ShrinkClip
          </h1>
          <p className="text-zinc-300 text-xl mb-2 font-medium">
            Free online video tools
          </p>
          <p className="text-zinc-500 text-base max-w-xl mx-auto">
            Compress, convert, resize, mute, and rotate videos directly in your
            browser. No uploads, no accounts, no limits.
          </p>
        </div>

        <PrivacyBadge />

        {/* Tool grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        <Footer />
      </div>
    </main>
  );
}
