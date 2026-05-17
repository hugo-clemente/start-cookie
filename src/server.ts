import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import type { CookieOptions, RemoveCookieOptions } from './types'

export function serverGet(name: string): string | undefined {
  const v = getCookie(name)
  return v ?? undefined
}

export function serverSet(
  name: string,
  value: string,
  options?: CookieOptions,
): void {
  setCookie(name, value, options as Parameters<typeof setCookie>[2])
}

export function serverRemove(
  name: string,
  options?: RemoveCookieOptions,
): void {
  deleteCookie(name, options as Parameters<typeof deleteCookie>[1])
}
