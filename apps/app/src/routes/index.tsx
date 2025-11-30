import { createFileRoute } from '@tanstack/react-router'

import { useFetchAssessments } from '../hooks/useFetchAssessments'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const assessments = useFetchAssessments()
  console.log(assessments)
  return <div>Hello World!</div>
}
