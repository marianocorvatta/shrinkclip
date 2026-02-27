import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-end mb-2">
        <LanguageSwitcher />
      </div>
      <Link href="/" className="inline-block group">
        <Image
          src="/logo-w.png"
          alt="ShrinkClip logo"
          width={80}
          height={80}
          className="mx-auto mb-3 group-hover:scale-105 transition-transform duration-200"
          priority
        />
        <span className="block text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          ShrinkClip
        </span>
      </Link>
    </div>
  );
}
