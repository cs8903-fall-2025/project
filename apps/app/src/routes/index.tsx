import { createFileRoute } from '@tanstack/react-router'

import { useFetchAssessments } from '../hooks/useFetchAssessments'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const assessments = useFetchAssessments()
  return (
    <ul>
      {assessments.map((assessment) => (
        <div>{assessment.name}</div>
      ))}
    </ul>
  )
}
