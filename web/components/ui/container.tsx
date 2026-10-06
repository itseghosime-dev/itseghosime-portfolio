import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  const classes = ["mx-auto w-full max-w-[77.5rem] px-6 md:px-12", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
