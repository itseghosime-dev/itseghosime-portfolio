import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {sanityClient} from '@/sanity/lib/client'

const token = process.env.SANITY_API_READ_TOKEN

const {GET: enableDraftMode} = defineEnableDraftMode({
  client: sanityClient.withConfig({token: token || 'missing-preview-token'}),
})

export async function GET(request: Request) {
  if (!token) {
    return Response.json(
      {error: 'Draft preview is not configured.'},
      {status: 503},
    )
  }

  return enableDraftMode(request)
}
