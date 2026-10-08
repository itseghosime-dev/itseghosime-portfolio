import Image from "next/image";

import type { ImageAsset } from "@/types/home";

type NoteImageProps = {
  image: ImageAsset;
  priority?: boolean;
  variant?: "cover" | "inline";
};

export function NoteImage({
  image,
  priority = false,
  variant = "inline",
}: NoteImageProps) {
  const isCover = variant === "cover";

  return (
    <figure
      className={
        isCover
          ? "my-10 border-y border-black/[0.09] py-3 sm:my-12 sm:py-4"
          : "my-12 border border-black/[0.09] bg-surface p-2 sm:my-14"
      }
    >
      <div className="overflow-hidden bg-surface-layer">
        <Image
          alt={image.alt}
          blurDataURL={image.blurDataUrl}
          className="h-auto w-full"
          height={image.height}
          placeholder={image.blurDataUrl ? "blur" : "empty"}
          priority={priority}
          sizes={
            isCover
              ? "(min-width: 1024px) 740px, calc(100vw - 48px)"
              : "(min-width: 1024px) 720px, calc(100vw - 48px)"
          }
          src={image.url}
          width={image.width}
        />
      </div>
      {image.caption ? (
        <figcaption
          className={
            isCover
              ? "pt-3 font-mono text-[0.6875rem] leading-5 text-ink-muted"
              : "px-3 py-3 text-xs leading-5 text-ink-muted"
          }
        >
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
