import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/assessments/$assessmentId/submissions/$submissionId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/assessments/$assessmentId/submissions/$submissionId"!</div>
  )
}
