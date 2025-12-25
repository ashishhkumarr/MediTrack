import clsx from "classnames";
import { ButtonHTMLAttributes } from "react";

<<<<<<< HEAD
type Variant = "primary" | "secondary" | "ghost";
=======
type Variant = "primary" | "secondary" | "ghost" | "destructive";
>>>>>>> v2

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const baseStyles =
<<<<<<< HEAD
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-sm hover:bg-brand-dark focus-visible:ring-brand",
  secondary:
    "bg-white text-brand border border-brand/20 hover:border-brand/40 hover:bg-brand/5 focus-visible:ring-brand",
  ghost:
    "text-slate-600 hover:text-brand hover:bg-slate-100 focus-visible:ring-slate-200"
=======
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-strong focus-visible:ring-primary/40",
  secondary:
    "border border-border bg-surface text-text hover:border-primary/30 hover:bg-surface-muted/70 focus-visible:ring-primary/30",
  ghost:
    "text-text-muted hover:text-text hover:bg-surface-subtle focus-visible:ring-primary/20",
  destructive:
    "bg-danger text-white shadow-sm hover:bg-danger/90 focus-visible:ring-danger/40"
>>>>>>> v2
};

export const Button = ({
  children,
  className,
  variant = "primary",
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
<<<<<<< HEAD
        "px-4 py-2",
        "hover:scale-[1.01]",
=======
        "px-4 py-2 text-sm",
        "hover:translate-y-[-1px] active:translate-y-0",
>>>>>>> v2
        className
      )}
      {...props}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
};
