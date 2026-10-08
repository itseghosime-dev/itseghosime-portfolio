import {draftMode} from 'next/headers'

export async function getContentFetchOptions() {
  const {isEnabled} = await draftMode()

  return isEnabled
    ? ({perspective: 'drafts', stega: false} as const)
    : ({perspective: 'published', stega: false} as const)
}
