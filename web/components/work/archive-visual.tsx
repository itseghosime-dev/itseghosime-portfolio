import Image from 'next/image'

import type {ArchiveEntry} from '@/types/work'

type ArchiveVisualProps = {
  entry: ArchiveEntry
  priority?: boolean
  supporting?: boolean
}

export function ArchiveVisual({entry, priority = false, supporting = false}: ArchiveVisualProps) {
  const image = supporting ? entry.supportingImage : entry.coverImage

  if (image) {
    return (
      <div className="h-full w-full will-change-transform" data-archive-visual>
        <Image
          alt={image.alt}
          blurDataURL={image.blurDataUrl}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
          height={image.height}
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          priority={priority}
          sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1399px) calc(100vw - 96px), 1240px"
          src={image.url}
          width={image.width}
        />
      </div>
    )
  }

  return (
    <div
      className="relative h-full overflow-hidden bg-surface-container will-change-transform"
      aria-hidden="true"
      data-archive-visual
    >
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(65,105,225,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(65,105,225,0.12)_1px,transparent_1px)] [background-size:2rem_2rem]" />
      <div className="absolute top-1/2 left-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
      <div className="absolute top-1/2 left-1/2 size-[45%] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent/30 transition-transform duration-700 group-hover:rotate-[52deg] motion-reduce:transition-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(65,105,225,0.18),transparent_58%)]" />
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
        <span>Lab specimen</span>
        <span>{entry.status}</span>
      </div>
    </div>
  )
}
