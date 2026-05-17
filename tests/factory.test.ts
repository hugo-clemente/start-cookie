import { describe, expect, mock, test } from 'bun:test'

const getMock = mock<(name: string) => string | undefined>(() => undefined)
const setMock = mock<(name: string, value: string, opts?: unknown) => void>(
  () => {},
)
const removeMock = mock<(name: string, opts?: unknown) => void>(() => {})

mock.module('../src/isomorphic', () => ({
  getCookie: getMock,
  setCookie: setMock,
  removeCookie: removeMock,
}))

const { createCookie } = await import('../src/factory')

describe('createCookie', () => {
  test('exposes the bound name', () => {
    const c = createCookie('theme')
    expect(c.name).toBe('theme')
  })

  test('get delegates with bound name', () => {
    getMock.mockClear()
    getMock.mockReturnValueOnce('dark')
    const c = createCookie('theme')
    expect(c.get()).toBe('dark')
    expect(getMock).toHaveBeenCalledWith('theme')
  })

  test('set uses default options', () => {
    setMock.mockClear()
    const c = createCookie('theme', { path: '/', sameSite: 'lax' })
    c.set('dark')
    expect(setMock).toHaveBeenCalledWith('theme', 'dark', {
      path: '/',
      sameSite: 'lax',
    })
  })

  test('set per-call options override defaults', () => {
    setMock.mockClear()
    const c = createCookie('theme', { path: '/', maxAge: 60 })
    c.set('dark', { maxAge: 3600 })
    expect(setMock).toHaveBeenCalledWith('theme', 'dark', {
      path: '/',
      maxAge: 3600,
    })
  })

  test('remove inherits path and domain from defaults', () => {
    removeMock.mockClear()
    const c = createCookie('theme', { path: '/app', domain: 'x.io', maxAge: 60 })
    c.remove()
    expect(removeMock).toHaveBeenCalledWith('theme', {
      path: '/app',
      domain: 'x.io',
    })
  })

  test('remove per-call options override default path', () => {
    removeMock.mockClear()
    const c = createCookie('theme', { path: '/app' })
    c.remove({ path: '/other' })
    expect(removeMock).toHaveBeenCalledWith('theme', { path: '/other' })
  })
})
