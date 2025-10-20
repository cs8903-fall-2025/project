// @ts-check
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'astro/config'

import AstroPWA from '@vite-pwa/astro'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

import manifest from './config/manifest'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  adapter: cloudflare(),
  integrations: [
    AstroPWA({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      mode: import.meta.env.PROD ? 'production' : 'development',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest,
      pwaAssets: {
        config: true,
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
        globIgnores: ['**/_worker.js/**/*', '_worker.js'],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
})
