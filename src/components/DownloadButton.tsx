interface DownloadButtonProps {
  url: string;
  filename: string;
  label: string;
}

export default function DownloadButton({
  url,
  filename,
  label,
}: DownloadButtonProps) {
  return (
    <a
      href={url}
      download={filename}
      className={[
        "flex items-center justify-center gap-2",
        "w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base",
        "bg-gradient-to-r from-accent-dim to-navy",
        "hover:from-accent hover:to-navy-light",
        "transition-all duration-200 shadow-lg shadow-accent/20",
        "active:scale-[0.98]",
      ].join(" ")}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {label}
    </a>
  );
}
