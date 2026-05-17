import { describe, expect, test } from 'bun:test'
import { serializeCookie } from '../src/client'

describe('serializeCookie', () => {
  test('serializes name and percent-encoded value', () => {
    expect(serializeCookie('greeting', 'hello world')).toBe(
      'greeting=hello%20world',
    )
  })

  test('appends Path', () => {
    expect(serializeCookie('a', '1', { path: '/' })).toBe('a=1; Path=/')
  })

  test('appends Domain', () => {
    expect(serializeCookie('a', '1', { domain: 'example.com' })).toBe(
      'a=1; Domain=example.com',
    )
  })

  test('appends Max-Age', () => {
    expect(serializeCookie('a', '1', { maxAge: 3600 })).toBe('a=1; Max-Age=3600')
  })

  test('floors fractional Max-Age', () => {
    expect(serializeCookie('a', '1', { maxAge: 1.9 })).toBe('a=1; Max-Age=1')
  })

  test('appends Expires as UTC string', () => {
    const d = new Date('2030-01-02T03:04:05.000Z')
    expect(serializeCookie('a', '1', { expires: d })).toBe(
      `a=1; Expires=${d.toUTCString()}`,
    )
  })

  test('appends SameSite=Strict for true', () => {
    expect(serializeCookie('a', '1', { sameSite: true })).toBe(
      'a=1; SameSite=Strict',
    )
  })

  test('appends SameSite from string', () => {
    expect(serializeCookie('a', '1', { sameSite: 'lax' })).toBe(
      'a=1; SameSite=Lax',
    )
  })

  test('emits SameSite=None with Secure when both set', () => {
    expect(serializeCookie('a', '1', { sameSite: 'none', secure: true })).toBe(
      'a=1; SameSite=None; Secure',
    )
  })

  test('appends Secure flag', () => {
    expect(serializeCookie('a', '1', { secure: true })).toBe('a=1; Secure')
  })

  test('omits HttpOnly (client cannot set it)', () => {
    expect(serializeCookie('a', '1', { httpOnly: true })).toBe('a=1')
  })

  test('appends Partitioned', () => {
    expect(serializeCookie('a', '1', { partitioned: true })).toBe(
      'a=1; Partitioned',
    )
  })

  test('appends Priority capitalized', () => {
    expect(serializeCookie('a', '1', { priority: 'high' })).toBe(
      'a=1; Priority=High',
    )
  })

  test('uses custom encode', () => {
    expect(serializeCookie('a', 'raw', { encode: (v) => `[${v}]` })).toBe(
      'a=[raw]',
    )
  })

  test('combines multiple options in canonical order', () => {
    const d = new Date('2030-01-01T00:00:00.000Z')
    expect(
      serializeCookie('s', 'v', {
        path: '/app',
        domain: 'x.io',
        maxAge: 60,
        expires: d,
        sameSite: 'lax',
        secure: true,
        partitioned: true,
        priority: 'medium',
      }),
    ).toBe(
      `s=v; Path=/app; Domain=x.io; Max-Age=60; Expires=${d.toUTCString()}; SameSite=Lax; Secure; Partitioned; Priority=Medium`,
    )
  })
})
