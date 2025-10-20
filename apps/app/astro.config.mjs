// @ts-check
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'astro/config'

import AstroPWA from '@vite-pwa/astro'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [AstroPWA(), react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
})
