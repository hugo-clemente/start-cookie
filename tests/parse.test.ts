import { describe, expect, test } from 'bun:test'
import { parseDocumentCookies } from '../src/client'

describe('parseDocumentCookies', () => {
  test('returns empty object for empty string', () => {
    expect(parseDocumentCookies('')).toEqual({})
  })

  test('parses a single cookie', () => {
    expect(parseDocumentCookies('locale=en-US')).toEqual({ locale: 'en-US' })
  })

  test('parses multiple cookies separated by "; "', () => {
    expect(parseDocumentCookies('locale=en-US; tz=UTC')).toEqual({
      locale: 'en-US',
      tz: 'UTC',
    })
  })

  test('tolerates missing space after semicolon', () => {
    expect(parseDocumentCookies('a=1;b=2')).toEqual({ a: '1', b: '2' })
  })

  test('decodes percent-encoded values', () => {
    expect(parseDocumentCookies('greeting=hello%20world')).toEqual({
      greeting: 'hello world',
    })
  })

  test('returns first occurrence on duplicate name', () => {
    expect(parseDocumentCookies('x=1; x=2')).toEqual({ x: '1' })
  })

  test('handles values containing "="', () => {
    expect(parseDocumentCookies('token=abc=def=ghi')).toEqual({
      token: 'abc=def=ghi',
    })
  })

  test('skips malformed parts with no "="', () => {
    expect(parseDocumentCookies('a=1; oops; b=2')).toEqual({ a: '1', b: '2' })
  })

  test('returns raw value if decode throws', () => {
    expect(parseDocumentCookies('bad=%E0%A4%A')).toEqual({ bad: '%E0%A4%A' })
  })

  test('trims surrounding whitespace on name', () => {
    expect(parseDocumentCookies('a=1;   b=2')).toEqual({ a: '1', b: '2' })
  })
})
