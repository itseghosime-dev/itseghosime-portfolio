import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

async function disableDraftMode(request: Request) {
  const draft = await draftMode()
  draft.disable()

  return NextResponse.redirect(new URL('/', request.url), {status: 307})
}

export const GET = disableDraftMode
export const POST = disableDraftMode
