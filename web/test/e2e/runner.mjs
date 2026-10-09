import puppeteer from 'puppeteer'
import {pathToFileURL} from 'node:url'
import {getPublishedRoutes, VIEWPORTS} from '../support/routes.mjs'
import {withProductionServer} from '../support/server.mjs'

function hasExpectedStatus(response, expected) {
  return response && (response.status() === expected || (expected === 200 && response.status() === 304))
}

async function runE2E(baseUrl) {
  const routes = await getPublishedRoutes(baseUrl)
  const projectRoute = routes.find((route) => route.label === 'Project Detail')
  const noteRoute = routes.find((route) => route.label === 'Note Detail')
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']})
  const results = []

  async function test(name, callback) {
    const started = Date.now()
    try {
      await callback()
      results.push({name, passed: true, duration: Date.now() - started})
      console.log(`  ✓ ${name}`)
    } catch (error) {
      results.push({name, passed: false, duration: Date.now() - started, error: error.message})
      console.error(`  ✗ ${name}: ${error.message}`)
    }
  }

  try {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      await test(`Major routes render without horizontal overflow (${viewportName})`, async () => {
        const page = await browser.newPage()
        await page.setViewport(viewport)
        try {
          for (const route of routes) {
            const response = await page.goto(`${baseUrl}${route.path}`, {waitUntil: 'domcontentloaded'})
            const expected = route.expectedStatus ?? 200
            if (!hasExpectedStatus(response, expected)) {
              throw new Error(`${route.path} returned ${response?.status()}, expected ${expected}`)
            }
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
            if (overflow > 1) throw new Error(`${route.path} overflows horizontally by ${overflow}px`)
          }
        } finally {
          await page.close()
        }
      })
    }

    await test('Home renders its primary content', async () => {
      const page = await browser.newPage()
      try {
        await page.goto(baseUrl, {waitUntil: 'domcontentloaded'})
        if (!await page.$('#hero-title')) throw new Error('Hero title is missing')
        if (!(await page.title()).toLowerCase().includes('itseghosime')) throw new Error('Document title is incorrect')
      } finally {
        await page.close()
      }
    })

    await test('Work archive search and project navigation work', async () => {
      const page = await browser.newPage()
      try {
        await page.goto(`${baseUrl}/work`, {waitUntil: 'networkidle2'})
        const input = await page.$('input[placeholder*="Search"]')
        if (!input) throw new Error('Work search is missing')
        await input.type('Skinny')
        await page.waitForFunction(() => Boolean(document.querySelector('a[href*="skinny-cans"]')))
        if (!projectRoute) throw new Error('No published project detail route was found in the sitemap')
        await page.goto(`${baseUrl}${projectRoute.path}`, {waitUntil: 'domcontentloaded'})
        if (!await page.$('h1')) throw new Error('Project heading is missing')
      } finally {
        await page.close()
      }
    })

    await test('Notes archive and note detail render', async () => {
      const page = await browser.newPage()
      try {
        await page.goto(`${baseUrl}/notes`, {waitUntil: 'domcontentloaded'})
        if (!await page.$('input[placeholder*="Search"]')) throw new Error('Notes search is missing')
        if (noteRoute) {
          const response = await page.goto(`${baseUrl}${noteRoute.path}`, {waitUntil: 'domcontentloaded'})
          if (!hasExpectedStatus(response, 200) || !await page.$('article')) throw new Error(`Note detail did not render (HTTP ${response?.status()})`)
        }
      } finally {
        await page.close()
      }
    })

    await test('Contact form exposes labelled fields', async () => {
      const page = await browser.newPage()
      try {
        await page.goto(`${baseUrl}/contact`, {waitUntil: 'domcontentloaded'})
        for (const selector of ['input[name="fullName"]', 'input[name="email"]', 'textarea[name="message"]', 'button[type="submit"]']) {
          if (!await page.$(selector)) throw new Error(`Missing contact control: ${selector}`)
        }
      } finally {
        await page.close()
      }
    })

    await test('Mobile navigation opens, traps focus and closes with Escape', async () => {
      const page = await browser.newPage()
      await page.setViewport(VIEWPORTS.mobile)
      try {
        await page.goto(baseUrl, {waitUntil: 'domcontentloaded'})
        await page.click('button[aria-label="Open navigation menu"]')
        await page.waitForSelector('[role="dialog"][aria-label="Mobile navigation"]', {visible: true})
        const focusIsInside = await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement))
        if (!focusIsInside) throw new Error('Focus did not move into the mobile navigation')
        await page.keyboard.press('Escape')
        await page.waitForFunction(() => !document.querySelector('[role="dialog"][aria-label="Mobile navigation"]'))
      } finally {
        await page.close()
      }
    })

    await test('Reduced-motion mode avoids the smooth-scroll runtime', async () => {
      const page = await browser.newPage()
      await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}])
      try {
        await page.goto(baseUrl, {waitUntil: 'networkidle2'})
        const state = await page.evaluate(() => ({
          reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
          lenis: document.documentElement.classList.contains('lenis'),
        }))
        if (!state.reduced) throw new Error('Reduced-motion media query is not active')
        if (state.lenis) throw new Error('Lenis initialized despite reduced-motion preference')
      } finally {
        await page.close()
      }
    })
  } finally {
    await browser.close()
  }

  const failed = results.filter((result) => !result.passed)
  console.log(`\nE2E: ${results.length - failed.length}/${results.length} passed`)
  if (failed.length) throw new Error(`${failed.length} E2E checks failed`)
}

export {runE2E}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  withProductionServer(runE2E).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
