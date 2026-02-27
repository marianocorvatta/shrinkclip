import { Link } from "@/i18n/navigation";

interface ToolCardProps {
  name: string;
  href: "/compress-video" | "/convert-video" | "/resize-video" | "/mute-video" | "/rotate-video";
  description: string;
  shortDescription: string;
}

export default function ToolCard({
  name,
  href,
  description,
  shortDescription,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={[
        "block p-5 bg-zinc-900 rounded-xl border border-zinc-800",
        "hover:border-violet-500/50 hover:bg-zinc-800/80",
        "transition-all duration-200 group",
      ].join(" ")}
    >
      <h2 className="text-zinc-100 font-semibold text-base mb-1 group-hover:text-violet-400 transition-colors">
        {name}
      </h2>
      <p className="text-zinc-500 text-sm">{description}</p>
      <p className="text-zinc-600 text-xs mt-2">{shortDescription}</p>
    </Link>
  );
}
