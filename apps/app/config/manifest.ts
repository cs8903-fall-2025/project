import type { ManifestOptions } from 'vite-plugin-pwa'

const manifest: Partial<ManifestOptions> = {
  name: 'Autograder',
  short_name: 'Autograder',
  description: 'Scan and grade homework, quizes, tests, exams and more...',
  theme_color: '#000000',
  background_color: '#ffffff',
  display: 'minimal-ui',
}

export default manifest
