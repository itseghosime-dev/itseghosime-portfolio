export const CORE_ROUTES = [
  {path: '/', label: 'Home'},
  {path: '/work', label: 'Work Archive'},
  {path: '/about', label: 'About'},
  {path: '/lab', label: 'Lab'},
  {path: '/notes', label: 'Notes Archive'},
  {path: '/contact', label: 'Contact'},
  {path: '/nonexistent-404-check', label: '404 Page', expectedStatus: 404},
]

export async function getPublishedRoutes(baseUrl) {
  const response = await fetch(`${baseUrl}/sitemap.xml`)
  const sitemap = response.ok ? await response.text() : ''
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap((match) => {
    try {
      return [new URL(match[1]).pathname]
    } catch {
      return []
    }
  })
  const project = paths.find((pathname) => /^\/work\/[^/]+$/.test(pathname))
  const note = paths.find((pathname) => /^\/notes\/[^/]+$/.test(pathname))
  return [
    ...CORE_ROUTES,
    ...(project ? [{path: project, label: 'Project Detail'}] : []),
    ...(note ? [{path: note, label: 'Note Detail'}] : []),
  ]
}

export const VIEWPORTS = {
  mobile: {width: 390, height: 844, isMobile: true, hasTouch: true},
  tablet: {width: 768, height: 1024, isMobile: false, hasTouch: true},
  desktop: {width: 1440, height: 900, isMobile: false, hasTouch: false},
}
