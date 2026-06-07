"use client";

import { RevealText } from "@/components/motion/RevealText";
import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  lead,
  center = false,
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      <span className={cn("eyebrow", center && "eyebrow--center")} data-reveal data-reveal-anchor>
        {eyebrow}
      </span>
      <RevealText as="h2" text={title} className="text-h1 mt-5" />
      {lead && (
        <p className="text-lead mt-5" data-reveal>
          {lead}
        </p>
      )}
    </div>
  );
}
