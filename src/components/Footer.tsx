import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="mt-8 text-center">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
          >
            {tool.name}
          </Link>
        ))}
      </nav>
      <p className="text-zinc-700 text-xs">
        Powered by FFmpeg.wasm · 100% browser-based
      </p>
    </footer>
  );
}
