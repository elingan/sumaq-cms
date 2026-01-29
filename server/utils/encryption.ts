import crypto from 'crypto'
import { App } from '@octokit/app'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const key = process.env.GITHUB_TOKEN_ENCRYPTION_KEY
  if (!key) {
    throw new Error('GITHUB_TOKEN_ENCRYPTION_KEY is not set')
  }
  return Buffer.from(key, 'hex')
}

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)

  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Formato: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decryptToken(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':')

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted data format')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)

  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

// GitHub App instance
let appInstance: App | null = null

export function getGitHubApp(): App {
  if (appInstance) return appInstance

  const appId = process.env.GITHUB_APP_ID
  const privateKey = process.env.GITHUB_PRIVATE_KEY
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!appId || !privateKey || !clientId || !clientSecret) {
    throw new Error('GitHub App credentials not configured')
  }

  appInstance = new App({
    appId,
    privateKey: privateKey.replace(/\\n/g, '\n'), // Fix escaped newlines
    oauth: {
      clientId,
      clientSecret,
    },
  })

  return appInstance
}

// Generate installation access token
export async function getInstallationToken(installationId: number): Promise<string> {
  const app = getGitHubApp()
  const octokit = await app.getInstallationOctokit(installationId)

  // This token is automatically generated and managed by Octokit
  // It's short-lived (1 hour) and refreshed automatically
  return octokit.auth({
    type: 'installation',
  }) as Promise<string>
}
