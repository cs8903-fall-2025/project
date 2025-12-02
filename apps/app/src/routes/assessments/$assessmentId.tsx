import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useFetchAssessment } from '@/hooks/useFetchAssessment'

export const Route = createFileRoute('/assessments/$assessmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const assessment = useFetchAssessment({ assessmentId })

  if (!assessment) {
    return null
  }

  return assessment.name
}
