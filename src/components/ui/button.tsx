import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "gold";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 select-none",
    "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-text-3 disabled:shadow-none",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-3 text-base",
    variant === "primary" && [
      "bg-surface-2 text-text-1 border border-border-2",
      "hover:border-purple/30 hover:text-gold hover:bg-card-hover",
      "active:scale-[0.98]",
    ],
    variant === "gold" && [
      "bg-purple-gradient text-bg font-semibold border border-purple/30",
      "hover:opacity-90 hover:shadow-purple",
      "active:scale-[0.98]",
    ],
    variant === "outline" && [
      "border border-border-2 bg-surface/80 text-text-1",
      "hover:border-purple/40 hover:text-gold hover:bg-card-hover",
      "active:scale-[0.98]",
    ],
    variant === "ghost" && [
      "border border-transparent bg-transparent text-text-1",
      "hover:text-gold hover:bg-surface-2",
      "active:scale-[0.98]",
    ],
    className
  );
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}
