"use client";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  label: string;
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  hint?: string | null;
  columns?: 2 | 3 | 4 | 5;
}

const colClasses: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

export default function OptionSelector({
  label,
  options,
  selected,
  onChange,
  hint,
  columns = 3,
}: OptionSelectorProps) {
  return (
    <div>
      <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className={`grid ${colClasses[columns] ?? "grid-cols-3"} gap-2`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150",
              selected === opt.value
                ? "bg-accent-dim text-white shadow-lg shadow-accent/20"
                : "bg-navy text-zinc-400 hover:bg-navy-light hover:text-zinc-100",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {hint ? (
        <p className="text-zinc-600 text-xs mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}
