import { describe, expect, mock, test } from 'bun:test'

// Mock the @tanstack/react-start surface so importing src/index doesn't pull
// in the real server runtime (which may have import-time side effects when
// loaded outside a Start request context).
mock.module('@tanstack/react-start/server', () => ({
  getCookie: () => undefined,
  setCookie: () => {},
  deleteCookie: () => {},
}))

mock.module('@tanstack/react-start', () => ({
  createIsomorphicFn: () => {
    let clientImpl: ((...args: Array<unknown>) => unknown) | undefined
    const callable = ((...args: Array<unknown>) => clientImpl?.(...args)) as unknown as {
      server(fn: (...args: Array<unknown>) => unknown): typeof callable
      client(fn: (...args: Array<unknown>) => unknown): typeof callable
    }
    callable.server = () => callable
    callable.client = (fn) => {
      clientImpl = fn
      return callable
    }
    return callable
  },
}))

describe('public API surface', () => {
  test('exports all documented names', async () => {
    const mod = await import('../src/index')
    expect(typeof mod.getCookie).toBe('function')
    expect(typeof mod.setCookie).toBe('function')
    expect(typeof mod.removeCookie).toBe('function')
    expect(typeof mod.createCookie).toBe('function')
  })
})
