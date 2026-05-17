import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  dts: true,
  exports: {
    packageJson: true,
    legacy: true,
  },
  deps: {
    neverBundle: [/^@tanstack\//],
  },
  clean: true,
})
