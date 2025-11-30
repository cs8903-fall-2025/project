import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { openDatabase, closeDatabase } from './lib/db'
import { initAssessmentsCollection } from './collections/assessments'
import { App } from './app'

import './index.css'

try {
  await openDatabase()
  await initAssessmentsCollection()
} catch (error) {
  console.error('Unable to open database: ', error)
}

const element = document.getElementById('root')
if (element) {
  createRoot(element).render(
    <StrictMode>
      <App onDestroy={closeDatabase} />
    </StrictMode>,
  )
} else {
  console.error('Unable to create application')
}
