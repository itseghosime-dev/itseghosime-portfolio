import type { HTMLAttributes } from "react";

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement>;

export function StatusBadge({ className, ...props }: StatusBadgeProps) {
  const classes = ["status-badge", className].filter(Boolean).join(" ");

  return <span className={classes} {...props} />;
}
