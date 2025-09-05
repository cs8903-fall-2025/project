import eslintJsConfig from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import turboConfig from 'eslint-plugin-turbo'
import tsConfig from 'typescript-eslint'

export const baseConfig = [
  prettierConfig,
  eslintJsConfig.configs.recommended,
  turboConfig.configs['flat/recommended'],
  ...tsConfig.configs.recommended,
]
