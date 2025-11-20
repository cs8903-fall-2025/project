import { baseConfig } from '@repo/config-eslint/base-config'
import astroBaseConfig from 'eslint-plugin-astro'

/** @type {import('eslint').Linter.Config} */
export default [
  ...baseConfig,
  ...astroBaseConfig.configs.recommended,
  {
    ignores: ['.astro', '.turbo', 'dev-dist', 'dist/**', 'public'],
  },
]
