import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { clientGet, clientRemove, clientSet } from '../src/client'

type FakeDocument = { cookie: string }

let originalDocument: unknown
let fake: FakeDocument

beforeEach(() => {
  originalDocument = (globalThis as { document?: unknown }).document
  fake = { cookie: '' }
  Object.defineProperty(fake, 'cookie', {
    configurable: true,
    get(this: { _store: string }) {
      return this._store ?? ''
    },
    set(this: { _store: string }, value: string) {
      if (!this._store) {
        this._store = value
        return
      }
      const incomingName = value.split('=')[0]!
      const existing = this._store.split('; ').filter(
        (part) => part.split('=')[0] !== incomingName,
      )
      existing.push(value.split(';')[0]!)
      this._store = existing.join('; ')
    },
  })
  ;(globalThis as { document?: unknown }).document = fake
})

afterEach(() => {
  ;(globalThis as { document?: unknown }).document = originalDocument
})

describe('clientGet', () => {
  test('returns undefined when document is undefined', () => {
    ;(globalThis as { document?: unknown }).document = undefined
    expect(clientGet('x')).toBeUndefined()
  })

  test('reads existing cookie from document.cookie', () => {
    ;(fake as unknown as { _store: string })._store = 'a=1; b=hello%20world'
    expect(clientGet('a')).toBe('1')
    expect(clientGet('b')).toBe('hello world')
  })

  test('returns undefined for missing cookie', () => {
    ;(fake as unknown as { _store: string })._store = 'a=1'
    expect(clientGet('missing')).toBeUndefined()
  })
})

describe('clientSet', () => {
  test('no-op when document is undefined', () => {
    ;(globalThis as { document?: unknown }).document = undefined
    expect(() => clientSet('x', '1')).not.toThrow()
  })

  test('writes name=value', () => {
    clientSet('a', '1')
    expect(clientGet('a')).toBe('1')
  })

  test('forwards options through serializeCookie', () => {
    clientSet('a', 'v', { path: '/', maxAge: 60 })
    expect((fake as unknown as { _store: string })._store).toContain('a=v')
  })
})

describe('clientRemove', () => {
  test('writes Max-Age=0 with matching path', () => {
    let lastWrite = ''
    Object.defineProperty(fake, 'cookie', {
      configurable: true,
      get: () => '',
      set: (value: string) => {
        lastWrite = value
      },
    })
    clientRemove('a', { path: '/app' })
    expect(lastWrite).toBe('a=; Path=/app; Max-Age=0')
  })
})
