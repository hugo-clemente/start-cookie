import type { CookieOptions } from './types'

export function parseDocumentCookies(source: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!source) return out
  const parts = source.split(';')
  for (const raw of parts) {
    const part = raw.trimStart()
    if (!part) continue
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const name = part.slice(0, eq).trim()
    if (!name || name in out) continue
    const rawValue = part.slice(eq + 1).trim()
    let value: string
    try {
      value = decodeURIComponent(rawValue)
    } catch {
      value = rawValue
    }
    out[name] = value
  }
  return out
}

const CAPITALIZED_SAMESITE: Record<string, string> = {
  strict: 'Strict',
  lax: 'Lax',
  none: 'None',
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  const encode = options.encode ?? encodeURIComponent
  const parts: Array<string> = [`${name}=${encode(value)}`]

  if (options.path !== undefined) parts.push(`Path=${options.path}`)
  if (options.domain !== undefined) parts.push(`Domain=${options.domain}`)
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge)}`)
  if (options.expires !== undefined) parts.push(`Expires=${options.expires.toUTCString()}`)

  if (options.sameSite !== undefined) {
    const ss =
      options.sameSite === true
        ? 'Strict'
        : options.sameSite === false
          ? undefined
          : CAPITALIZED_SAMESITE[options.sameSite]
    if (ss) parts.push(`SameSite=${ss}`)
  }

  if (options.secure) parts.push('Secure')
  // httpOnly intentionally ignored — JS cannot set it via document.cookie
  if (options.partitioned) parts.push('Partitioned')
  if (options.priority) {
    parts.push(`Priority=${options.priority[0]!.toUpperCase()}${options.priority.slice(1)}`)
  }

  return parts.join('; ')
}
