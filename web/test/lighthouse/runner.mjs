import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {launch} from 'chrome-launcher'
import lighthouse from 'lighthouse'
import {getPublishedRoutes} from '../support/routes.mjs'
import {withProductionServer} from '../support/server.mjs'

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const REPORT_DIR = path.join(WEB_ROOT, 'test-results', 'lighthouse')
const PERFORMANCE_MINIMUM = Number(process.env.LIGHTHOUSE_PERFORMANCE_MINIMUM ?? 0.9)

const configurations = {
  mobile: {
    formFactor: 'mobile',
    screenEmulation: {mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false},
  },
  desktop: {
    formFactor: 'desktop',
    screenEmulation: {mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false},
    throttling: {
      cpuSlowdownMultiplier: 1,
      downloadThroughputKbps: 0,
      requestLatencyMs: 0,
      rttMs: 40,
      throughputKbps: 10_240,
      uploadThroughputKbps: 0,
    },
  },
}

async function runLighthouse(baseUrl) {
  const routes = await getPublishedRoutes(baseUrl)
  await fs.mkdir(REPORT_DIR, {recursive: true})
  const chrome = await launch({chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']})
  const results = []
  try {
    for (const [device, deviceConfig] of Object.entries(configurations)) {
      for (const route of routes.filter((item) => !item.expectedStatus)) {
        const report = await lighthouse(`${baseUrl}${route.path}`, {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          ...deviceConfig,
        })
        if (!report?.lhr) throw new Error(`Lighthouse returned no report for ${route.path}`)
        const scores = Object.fromEntries(Object.entries(report.lhr.categories).map(([key, value]) => [key, value.score ?? 0]))
        results.push({device, route, scores})
        const name = route.path === '/' ? 'home' : route.path.replaceAll('/', '-').replace(/^-/, '')
        await fs.writeFile(path.join(REPORT_DIR, `${name}-${device}.json`), report.report)
        console.log(`  ${device.padEnd(7)} ${route.path.padEnd(40)} P ${Math.round(scores.performance * 100)} · A ${Math.round(scores.accessibility * 100)} · BP ${Math.round(scores['best-practices'] * 100)} · SEO ${Math.round(scores.seo * 100)}`)
      }
    }
  } finally {
    await chrome.kill()
  }

  const failed = results.filter(({scores}) => (
    scores.performance < PERFORMANCE_MINIMUM ||
    scores.accessibility < 1 ||
    scores['best-practices'] < 1 ||
    scores.seo < 1
  ))
  console.log(`\nLighthouse: ${results.length - failed.length}/${results.length} audits met the quality budget`)
  if (failed.length) {
    for (const item of failed) console.error(`  ✗ ${item.device} ${item.route.path}`, item.scores)
    throw new Error(`${failed.length} Lighthouse audits missed the quality budget`)
  }
}

export {runLighthouse}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  withProductionServer(runLighthouse).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
