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
