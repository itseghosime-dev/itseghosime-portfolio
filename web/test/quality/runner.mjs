import {stat, readdir} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import puppeteer from 'puppeteer'
import {getPublishedRoutes, VIEWPORTS} from '../support/routes.mjs'
import {withProductionServer} from '../support/server.mjs'

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PUBLIC_ROOT = path.join(WEB_ROOT, 'public')
const CONTENT_TYPES = ['project', 'note', 'labExperiment', 'profile', 'experience', 'aboutPage', 'siteSettings']

async function listFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true})
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? listFiles(target) : [target]
  }))).flat()
}

async function requestLink(url) {
  const timeout = AbortSignal.timeout(15_000)
  let response = await fetch(url, {method: 'HEAD', redirect: 'follow', signal: timeout})
  if ([400, 405].includes(response.status)) {
    response = await fetch(url, {method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15_000)})
  }
  return response
}

function collectImages(value, location = 'document', results = []) {
  if (!value || typeof value !== 'object') return results
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectImages(item, `${location}[${index}]`, results))
    return results
  }
  if (value._type === 'image' || value.asset?._ref?.startsWith('image-')) {
    results.push({location, alt: typeof value.alt === 'string' ? value.alt.trim() : ''})
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'asset') collectImages(child, `${location}.${key}`, results)
  }
  return results
}

function collectEditorialText(value, field = '', results = []) {
  if (typeof value === 'string') {
    if (!field.startsWith('_') && !['code', 'href', 'language', 'platform', 'slug', 'url'].includes(field) && !value.startsWith('http')) results.push(value)
    return results
  }
  if (!value || typeof value !== 'object') return results
  if (Array.isArray(value)) value.forEach((item) => collectEditorialText(item, field, results))
  else for (const [key, child] of Object.entries(value)) collectEditorialText(child, key, results)
  return results
}

async function auditSanityContent() {
  const query = `*[_type in ${JSON.stringify(CONTENT_TYPES)} && !(_id in path("drafts.**"))]`
  const endpoint = `https://s3e4rrk9.api.sanity.io/v2026-10-06/data/query/production?query=${encodeURIComponent(query)}`
  const response = await fetch(endpoint, {signal: AbortSignal.timeout(20_000)})
  if (!response.ok) throw new Error(`Sanity query returned HTTP ${response.status}`)
  const {result = []} = await response.json()
  const findings = []
  const brandRules = [
    [/\bnextjs\b/gi, 'Next.js'], [/\btypescript\b/gi, 'TypeScript'], [/\bjavascript\b/gi, 'JavaScript'],
    [/\bgithub\b/gi, 'GitHub'], [/\bhubspot\b/gi, 'HubSpot'], [/\bwordpress\b/gi, 'WordPress'],
    [/\bnodejs\b/gi, 'Node.js'], [/\bmake\.com\b/gi, 'Make.com'],
  ]

  for (const document of result) {
    const label = `${document._type}:${document.slug?.current ?? document.title ?? document.name ?? document._id}`
    for (const image of collectImages(document)) {
      if (!image.alt) findings.push(`${label} has an image without alt text at ${image.location}`)
    }
    for (const [startKey, endKey] of [['startDate', 'endDate'], ['startYear', 'endYear']]) {
      if (document[startKey] && document[endKey] && String(document[startKey]) > String(document[endKey])) {
        findings.push(`${label} has ${startKey} after ${endKey}`)
      }
    }
    const serialised = collectEditorialText(document).join(' ')
    for (const [pattern, preferred] of brandRules) {
      for (const match of serialised.matchAll(pattern)) {
        if (match[0] !== preferred) findings.push(`${label} uses “${match[0]}”; review capitalization as “${preferred}”`)
      }
    }
  }
  return {documents: result.length, findings: [...new Set(findings)]}
}

async function runQuality(baseUrl) {
  const routes = await getPublishedRoutes(baseUrl)
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']})
  const failures = []
  const warnings = []
  const allLinks = new Set()
  const imageUrls = new Set()

  try {
    for (const route of routes.filter((item) => !item.expectedStatus)) {
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        const page = await browser.newPage()
        await page.setViewport(viewport)
        try {
          await page.goto(`${baseUrl}${route.path}`, {waitUntil: 'networkidle2'})
          await page.evaluate(async () => {
            const distance = Math.max(300, Math.round(innerHeight * 0.8))
            for (let top = 0; top < document.documentElement.scrollHeight; top += distance) {
              scrollTo(0, top)
              await new Promise((resolve) => setTimeout(resolve, 40))
            }
            scrollTo(0, 0)
          })
          await new Promise((resolve) => setTimeout(resolve, 400))
          const result = await page.evaluate(async () => {
            const anchors = [...document.querySelectorAll('a[href]')].map((anchor) => anchor.href)
            const images = [...document.images].map((image) => ({
              src: image.currentSrc || image.src,
              alt: image.alt,
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
              renderedWidth: image.getBoundingClientRect().width,
              encodedBodySize: performance.getEntriesByName(image.currentSrc || image.src).at(-1)?.encodedBodySize ?? 0,
            }))
            return {anchors, images}
          })
          result.anchors.forEach((href) => allLinks.add(href))
          for (const image of result.images) {
            if (image.src) imageUrls.add(image.src)
            if (!image.alt.trim()) failures.push(`${route.path} (${viewportName}) has an image without alt text: ${image.src}`)
            if (image.encodedBodySize > 1_000_000) failures.push(`${route.path} (${viewportName}) loaded an image over 1MB (${Math.round(image.encodedBodySize / 1024)}KB): ${image.src}`)
            if (image.renderedWidth > 0 && image.naturalWidth > image.renderedWidth * 4) {
              warnings.push(`${route.path} (${viewportName}) loads an image over 4× its rendered width: ${image.src}`)
            }
          }
        } finally {
          await page.close()
        }
      }
    }

    for (const route of routes.filter((item) => !item.expectedStatus)) {
      const page = await browser.newPage()
      await page.setViewport(VIEWPORTS.desktop)
      try {
        await page.goto(`${baseUrl}${route.path}`, {waitUntil: 'domcontentloaded'})
        for (let index = 0; index < 8; index += 1) {
          await page.keyboard.press('Tab')
          const focus = await page.evaluate(() => {
            const element = document.activeElement
            if (!(element instanceof HTMLElement)) return null
            const style = getComputedStyle(element)
            return {
              tag: element.tagName,
              text: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 60),
              visible: Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length),
              indicator: style.outlineStyle !== 'none' || style.boxShadow !== 'none' || style.borderColor !== 'rgba(0, 0, 0, 0)',
            }
          })
          if (!focus?.visible) failures.push(`${route.path} keyboard focus became invisible on Tab ${index + 1}`)
          if (focus && !focus.indicator) failures.push(`${route.path} lacks a visible focus indicator on ${focus.tag} “${focus.text ?? ''}”`)
        }
      } finally {
        await page.close()
      }
    }

    for (const route of routes.filter((item) => !item.expectedStatus)) {
      const page = await browser.newPage()
      try {
        await page.setUserAgent('LinkedInBot/1.0')
        await page.goto(`${baseUrl}${route.path}`, {waitUntil: 'domcontentloaded'})
        const metadata = await page.evaluate(() => ({
          title: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
          description: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
          url: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
          image: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
          twitter: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        }))
        for (const key of ['title', 'description', 'url', 'image', 'twitter', 'canonical']) {
          if (!metadata[key]) failures.push(`${route.path} is missing social/SEO metadata: ${key}`)
        }
        if (metadata.image) {
          const imageSize = await page.evaluate(async (src) => new Promise((resolve) => {
            const image = new Image()
            image.onload = () => resolve({width: image.naturalWidth, height: image.naturalHeight})
            image.onerror = () => resolve({width: 0, height: 0})
            image.src = src
          }), metadata.image)
          if (imageSize.width < 1200 || imageSize.height < 630) {
            failures.push(`${route.path} social image is ${imageSize.width}×${imageSize.height}; expected at least 1200×630`)
          }
        }
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }

  for (const href of allLinks) {
    const url = new URL(href)
    if (['mailto:', 'tel:'].includes(url.protocol) || url.origin === new URL(baseUrl).origin) continue
    try {
      const response = await requestLink(href)
      if (response.status >= 400 && ![401, 403, 405, 429, 999].includes(response.status)) failures.push(`External link returned HTTP ${response.status}: ${href}`)
      else if ([401, 403, 405, 429, 999].includes(response.status)) warnings.push(`External link blocks automated verification (HTTP ${response.status}): ${href}`)
    } catch (error) {
      failures.push(`External link could not be reached: ${href} (${error.message})`)
    }
  }

  for (const src of imageUrls) {
    try {
      const response = await requestLink(src)
      const contentType = response.headers.get('content-type') ?? ''
      if (!response.ok || !contentType.startsWith('image/')) failures.push(`Image asset failed HTTP verification (${response.status}, ${contentType || 'unknown type'}): ${src}`)
    } catch (error) {
      failures.push(`Image asset could not be reached: ${src} (${error.message})`)
    }
  }

  for (const file of await listFiles(PUBLIC_ROOT)) {
    if (!/\.(avif|gif|jpe?g|png|webp)$/i.test(file)) continue
    const details = await stat(file)
    if (details.size > 1_000_000) failures.push(`Oversized local media (${Math.round(details.size / 1024)}KB): ${path.relative(WEB_ROOT, file)}`)
  }

  try {
    const content = await auditSanityContent()
    console.log(`Sanity content reviewed: ${content.documents} published documents`)
    warnings.push(...content.findings)
  } catch (error) {
    failures.push(`Sanity content audit failed: ${error.message}`)
  }

  console.log(`\nQuality audit: ${failures.length ? 'FAILED' : 'PASSED'}`)
  if (warnings.length) {
    console.log(`Warnings (${[...new Set(warnings)].length}):`)
    for (const warning of [...new Set(warnings)]) console.log(`  ! ${warning}`)
  }
  if (failures.length) {
    console.error(`Failures (${[...new Set(failures)].length}):`)
    for (const failure of [...new Set(failures)]) console.error(`  ✗ ${failure}`)
    throw new Error('Final quality audit failed')
  }
}

export {runQuality}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  withProductionServer(runQuality).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
