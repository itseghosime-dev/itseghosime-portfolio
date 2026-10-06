import type {ImageAsset} from '@/types/home'

export type ArchiveEntryKind = 'lab' | 'project'

export type ArchiveCategory = 'client' | 'experimental' | 'web'

export type ArchiveEntry = {
  coverImage?: ImageAsset
  categories: ArchiveCategory[]
  client?: string
  href?: string
  id: string
  kind: ArchiveEntryKind
  liveUrl?: string
  repositoryUrl?: string
  role?: string
  slug: string
  status: string
  subtitle: string
  supportingImage?: ImageAsset
  technologies: string[]
  timeline?: string
  title: string
  type: string
  year?: number
}

export type ArchiveFilter = 'all' | ArchiveCategory

export type ArchiveView = 'index' | 'visual'
