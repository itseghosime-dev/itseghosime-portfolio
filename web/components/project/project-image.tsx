import Image from "next/image";

import type { ProjectImageData } from "@/types/project";

type ProjectImageProps = {
  className?: string;
  image: ProjectImageData | null;
  priority?: boolean;
  sizes?: string;
};

export function ProjectImage({
  className = "",
  image,
  priority = false,
  sizes = "(max-width: 767px) calc(100vw - 48px), (max-width: 1399px) calc(100vw - 96px), 1180px",
}: ProjectImageProps) {
  if (!image?.url || !image.alt || !image.width || !image.height) return null;

  return (
    <Image
      alt={image.alt}
      blurDataURL={image.lqip ?? undefined}
      className={className}
      height={image.height}
      placeholder={image.lqip ? "blur" : "empty"}
      priority={priority}
      sizes={sizes}
      src={image.url}
      width={image.width}
    />
  );
}
