import { describe, expect, mock, test } from 'bun:test'

const getCookieMock = mock(() => 'mocked-value')
const setCookieMock = mock(() => {})
const deleteCookieMock = mock(() => {})

mock.module('@tanstack/react-start/server', () => ({
  getCookie: getCookieMock,
  setCookie: setCookieMock,
  deleteCookie: deleteCookieMock,
}))

const { serverGet, serverSet, serverRemove } = await import('../src/server')

describe('serverGet', () => {
  test('delegates to @tanstack/react-start/server getCookie', () => {
    getCookieMock.mockClear()
    const result = serverGet('locale')
    expect(getCookieMock).toHaveBeenCalledWith('locale')
    expect(result).toBe('mocked-value')
  })

  test('normalizes null to undefined', () => {
    getCookieMock.mockReturnValueOnce(null as unknown as string)
    expect(serverGet('missing')).toBeUndefined()
  })
})

describe('serverSet', () => {
  test('forwards name, value, options', () => {
    setCookieMock.mockClear()
    serverSet('a', '1', { path: '/', httpOnly: true })
    expect(setCookieMock).toHaveBeenCalledWith('a', '1', {
      path: '/',
      httpOnly: true,
    })
  })
})

describe('serverRemove', () => {
  test('forwards name and remove options', () => {
    deleteCookieMock.mockClear()
    serverRemove('a', { path: '/' })
    expect(deleteCookieMock).toHaveBeenCalledWith('a', { path: '/' })
  })
})
