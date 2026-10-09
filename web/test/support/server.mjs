import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 3210
      server.close(() => resolve(port))
    })
  })
}

async function waitForServer(url, child, timeoutMs = 45_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (child?.exitCode !== null) {
      throw new Error(`Next.js server exited early with code ${child.exitCode}`)
    }
    try {
      const response = await fetch(url, {redirect: 'manual'})
      if (response.status < 500) return
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 350))
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`)
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: WEB_ROOT,
      env: process.env,
      stdio: 'inherit',
      ...options,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) return
  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ])
  if (child.exitCode === null) {
    try {
      process.kill(-child.pid, 'SIGKILL')
    } catch {
      child.kill('SIGKILL')
    }
  }
}

export async function withProductionServer(runSuite) {
  if (process.env.TEST_BASE_URL) {
    await waitForServer(process.env.TEST_BASE_URL)
    return runSuite(process.env.TEST_BASE_URL)
  }

  if (process.env.TEST_SKIP_BUILD !== '1') {
    await run('npm', ['run', 'build'])
  }

  const port = await availablePort()
  const baseUrl = `http://127.0.0.1:${port}`
  const child = spawn('npm', ['run', 'start', '--', '-p', String(port)], {
    cwd: WEB_ROOT,
    detached: true,
    env: {...process.env, PORT: String(port)},
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const output = []
  child.stdout.on('data', (chunk) => output.push(chunk.toString()))
  child.stderr.on('data', (chunk) => output.push(chunk.toString()))

  try {
    await waitForServer(baseUrl, child)
    return await runSuite(baseUrl)
  } catch (error) {
    if (output.length) console.error(output.slice(-20).join(''))
    throw error
  } finally {
    await stopServer(child)
  }
}
