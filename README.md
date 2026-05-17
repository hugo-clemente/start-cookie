# start-cookie

Tiny isomorphic cookie helper for [TanStack Start](https://tanstack.com/start). String in, string out. Zero runtime dependencies.

```bash
bun add start-cookie
# or: pnpm / npm / yarn add start-cookie
```

Peer dependency: `@tanstack/react-start >= 1.168.0`.

## Usage

```ts
import {
  createCookie,
  getCookie,
  removeCookie,
  setCookie,
} from 'start-cookie'

// One-shot calls
const locale = getCookie('locale') ?? 'en-US'
setCookie('locale', 'fr-FR', { path: '/', maxAge: 60 * 60 * 24 * 365 })
removeCookie('locale', { path: '/' })

// Bound to a single cookie + default options
const theme = createCookie('theme', {
  path: '/',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
})

theme.get()           // 'dark' | undefined
theme.set('dark')     // inherits the defaults above
theme.remove()        // inherits path/domain from defaults
```

All four entry points run on both the server (via `@tanstack/react-start/server`) and the client (via `document.cookie`), wired through `createIsomorphicFn`.

## API

### `getCookie(name)`

Read a cookie. Returns `string | undefined`. Sync.

### `setCookie(name, value, options?)`

Write a cookie. `options` is `CookieOptions` (see `src/types.ts`).

### `removeCookie(name, options?)`

Delete a cookie. Pass the same `path` / `domain` you set it with — the browser drops a cookie by matching scope.

### `createCookie(name, defaultOptions?)`

Bind a cookie name and a default option set. Returns `{ name, get, set, remove }` where each per-call `options` is shallow-merged over the defaults (per-call wins).

## Notes

- `httpOnly: true` is honored on the server. On the client it's silently dropped — JavaScript can't set HttpOnly cookies via `document.cookie`.
- Values pass through `encodeURIComponent` on write and `decodeURIComponent` on read. Override via the `encode` option if you need raw bytes (e.g. signed tokens with `=` padding).
- Calling `setCookie` / `removeCookie` outside a server request scope inherits the behavior of `@tanstack/react-start/server` — start-cookie does not wrap or swallow those errors.

## License

MIT
