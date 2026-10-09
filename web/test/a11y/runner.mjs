import axe from 'axe-core'
import puppeteer from 'puppeteer'
import {pathToFileURL} from 'node:url'
import {getPublishedRoutes, VIEWPORTS} from '../support/routes.mjs'
import {withProductionServer} from '../support/server.mjs'

async function runAccessibility(baseUrl) {
  const routes = await getPublishedRoutes(baseUrl)
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']})
  const results = []
  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.setViewport(VIEWPORTS.desktop)
      try {
        const response = await page.goto(`${baseUrl}${route.path}`, {waitUntil: 'networkidle2'})
        const expected = route.expectedStatus ?? 200
        if (response?.status() !== expected) throw new Error(`HTTP ${response?.status()}, expected ${expected}`)
        await page.evaluate(axe.source)
        const audit = await page.evaluate(async () => window.axe.run(document, {
          runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']},
        }))
        results.push({route, violations: audit.violations})
        if (audit.violations.length) {
          console.error(`  ✗ ${route.label}: ${audit.violations.length} violation groups`)
          for (const violation of audit.violations) {
            console.error(`    ${violation.id} (${violation.impact}): ${violation.nodes.length} node(s)`)
            for (const node of violation.nodes.slice(0, 5)) console.error(`      ${node.target.join(' ')}`)
          }
        } else {
          console.log(`  ✓ ${route.label}`)
        }
      } catch (error) {
        results.push({route, error, violations: []})
        console.error(`  ✗ ${route.label}: ${error.message}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }

  const failed = results.filter((result) => result.error || result.violations.length)
  console.log(`\nAccessibility: ${results.length - failed.length}/${results.length} routes passed`)
  if (failed.length) throw new Error(`${failed.length} accessibility route audits failed`)
}

export {runAccessibility}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  withProductionServer(runAccessibility).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
