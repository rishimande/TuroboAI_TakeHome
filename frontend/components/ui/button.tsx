import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  children: React.ReactNode;
}

export function Button({
  variant = "default",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-[6px] px-4 py-3 rounded-[46px] font-bold text-base transition-all",
        "border border-[#957139] text-[#957139]",
        "hover:bg-[#957139] hover:text-white",
        "active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#957139] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
