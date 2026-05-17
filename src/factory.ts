import { getCookie, removeCookie, setCookie } from './isomorphic'
import type { CookieOptions, RemoveCookieOptions } from './types'

export type CookieHandle = {
  readonly name: string
  get(): string | undefined
  set(value: string, options?: CookieOptions): void
  remove(options?: RemoveCookieOptions): void
}

export function createCookie(
  name: string,
  defaultOptions?: CookieOptions,
): CookieHandle {
  const removeDefaults: RemoveCookieOptions = {
    ...(defaultOptions?.path !== undefined && { path: defaultOptions.path }),
    ...(defaultOptions?.domain !== undefined && { domain: defaultOptions.domain }),
  }

  return {
    name,
    get() {
      return getCookie(name)
    },
    set(value, options) {
      setCookie(name, value, { ...defaultOptions, ...options })
    },
    remove(options) {
      removeCookie(name, { ...removeDefaults, ...options })
    },
  }
}
