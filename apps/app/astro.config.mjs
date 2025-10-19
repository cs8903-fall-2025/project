// @ts-check
import { defineConfig } from 'astro/config'

import AstroPWA from '@vite-pwa/astro'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [AstroPWA(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
