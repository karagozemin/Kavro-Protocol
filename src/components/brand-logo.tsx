import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
  xl: "h-24 w-24 rounded-2xl",
};

type BrandLogoProps = {
  size?: keyof typeof sizeClasses;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  alt?: string;
  framed?: boolean;
};

export function BrandLogo({
  size = "md",
  className,
  imageClassName,
  priority = false,
  alt = "Kavro Protocol",
  framed = true,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden",
        sizeClasses[size],
        framed && "border border-gold/25 bg-surface shadow-purple-sm",
        className
      )}
    >
      <Image
        src="/kavrohigh.png"
        alt={alt}
        width={192}
        height={192}
        priority={priority}
        sizes="96px"
        className={cn("h-full w-full object-cover object-center", imageClassName)}
      />
    </span>
  );
}
