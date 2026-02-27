import Header from "./Header";
import PrivacyBadge from "./PrivacyBadge";
import Footer from "./Footer";

interface ToolPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolPageShell({
  title,
  description,
  children,
}: ToolPageShellProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 text-zinc-100 tracking-tight">
            {title}
          </h1>
          <p className="text-zinc-400">{description}</p>
        </div>
        <PrivacyBadge />
        <div className="bg-navy/40 rounded-2xl p-6 border border-navy-light shadow-2xl">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  );
}
