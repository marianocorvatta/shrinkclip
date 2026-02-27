import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const toolPaths = [
  { key: "compress", href: "/compress-video" as const },
  { key: "convert", href: "/convert-video" as const },
  { key: "resize", href: "/resize-video" as const },
  { key: "mute", href: "/mute-video" as const },
  { key: "rotate", href: "/rotate-video" as const },
];

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-8 text-center">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-3">
        {toolPaths.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
          >
            {t(`tools.${key}.name`)}
          </Link>
        ))}
      </nav>
      <p className="text-zinc-700 text-xs">{t("footer.poweredBy")}</p>
    </footer>
  );
}
