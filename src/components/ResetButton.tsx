interface ResetButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function ResetButton({ onClick, children }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full py-2.5 px-6 rounded-xl font-medium text-zinc-400",
        "bg-navy hover:bg-navy-light hover:text-zinc-100",
        "transition-all duration-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
