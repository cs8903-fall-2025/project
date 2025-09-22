import sharedConfig from '@repo/config-tailwindcss/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: [
    './src/components/**/*/.{js,jsx,ts,tsx,mdx}',
    './src/layouts/**/*.{js,jsx,ts,tsx,mdx}',
    './src/pages/**/*.{js,jsx,ts,tsx,mdx}',
  ],
}
