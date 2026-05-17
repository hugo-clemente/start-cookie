export type SameSite = 'strict' | 'lax' | 'none' | boolean

export type CookieOptions = {
  path?: string
  domain?: string
  maxAge?: number
  expires?: Date
  sameSite?: SameSite
  secure?: boolean
  httpOnly?: boolean
  partitioned?: boolean
  priority?: 'low' | 'medium' | 'high'
  encode?: (value: string) => string
}

export type RemoveCookieOptions = Pick<CookieOptions, 'path' | 'domain'>
