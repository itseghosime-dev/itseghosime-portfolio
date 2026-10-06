import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-semibold leading-5 tracking-[0.01em] no-underline transition-[background-color,border-color,color,transform] duration-150 ease-out motion-reduce:transition-none motion-safe:hover:-translate-y-px";

const variantClasses = {
  accent: "border border-transparent bg-accent text-white hover:bg-[#3457c4]",
  ghost: "border border-transparent bg-transparent text-ink-muted hover:bg-black/[0.04] hover:text-ink",
  primary: "border border-transparent bg-ink text-white hover:bg-accent",
  secondary:
    "border border-black/20 bg-transparent text-ink hover:border-ink hover:bg-surface-layer",
} satisfies Record<ButtonVariant, string>;

type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    variant?: ButtonVariant;
  };

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const classes = [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ");

  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  );
}
