interface ProgressBarProps {
  progress: number;
  label?: string;
  hint?: string;
}

export default function ProgressBar({
  progress,
  label = "Processing…",
  hint,
}: ProgressBarProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-zinc-400 font-medium">{label}</span>
        <span className="text-accent font-bold tabular-nums">
          {progress}%
        </span>
      </div>
      <div className="h-2.5 bg-navy rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-navy to-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {hint ? (
        <p className="text-zinc-600 text-xs text-center">{hint}</p>
      ) : null}
    </div>
  );
}
