import { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function SectionHeading({
  title,
  description,
  tag,
}: {
  title: string;
  description?: ReactNode;
  tag?: string;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-border pb-6">
      <BrandLogo size="md" className="mt-0.5 hidden sm:block" />
      <div className="space-y-2">
        {tag && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">{tag}</p>
        )}
        <h2 className="text-2xl font-semibold text-text-1">{title}</h2>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-text-2">{description}</p>
        )}
      </div>
    </div>
  );
}
