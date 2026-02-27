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
        "bg-gradient-to-r from-accent-dim to-navy",
        "hover:from-accent hover:to-navy-light",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200 shadow-lg shadow-accent/20",
        "active:scale-[0.98]",
      ].join(" ")}
    >
      {loading ? loadingText : children}
    </button>
  );
}
