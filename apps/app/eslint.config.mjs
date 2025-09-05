import honoConfig from '@hono/eslint-config'
import { baseConfig } from '@repo/config-eslint/base-config'

/** @type {import('eslint').Linter.Config} */
export default [
  ...baseConfig,
  ...honoConfig,
  {
    ignores: ['dist/**'],
  },
]
