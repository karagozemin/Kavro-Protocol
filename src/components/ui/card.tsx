import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "gold";
};

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "card-shine relative rounded-2xl border p-6 text-text-1 transition-shadow duration-300",
        variant === "default"  && "border-border bg-card/95 shadow-card hover:border-border-2 hover:shadow-card-hover",
        variant === "elevated" && "border-border-2 bg-card-hover shadow-card",
        variant === "gold"     && "border-purple/30 bg-card/95 shadow-purple",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
