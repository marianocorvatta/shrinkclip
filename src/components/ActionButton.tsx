interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function ActionButton({
  onClick,
  disabled,
  loading,
  loadingText = "Loading…",
  children,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base",
        "bg-gradient-to-r from-violet-600 to-purple-600",
        "hover:from-violet-500 hover:to-purple-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200 shadow-lg shadow-violet-500/20",
        "active:scale-[0.98]",
      ].join(" ")}
    >
      {loading ? loadingText : children}
    </button>
  );
}
