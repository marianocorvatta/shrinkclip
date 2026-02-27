"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: string) {
    router.replace({ pathname }, { locale: next });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={[
            "px-2 py-1 rounded-md font-medium transition-colors duration-150",
            loc === locale
              ? "bg-accent-dim text-white"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-navy",
          ].join(" ")}
          aria-label={`Switch to ${loc}`}
          aria-current={loc === locale ? "true" : undefined}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
