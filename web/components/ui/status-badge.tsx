import type { HTMLAttributes } from "react";

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement>;

export function StatusBadge({ className, ...props }: StatusBadgeProps) {
  const classes = [
    "inline-flex min-h-7 items-center gap-2 rounded bg-surface-layer px-2.5 py-1 text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-ink-soft before:size-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} {...props} />;
}
