import { createFileRoute } from '@tanstack/react-router'
import { useFetchSubmissions } from '@/hooks/useFetchSubmissions'

export const Route = createFileRoute('/assessments/$assessmentId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const submissions = useFetchSubmissions(assessmentId)

  return (
    <>
      {submissions.map((submission) => (
        <div>{submission.submissionId}</div>
      ))}
    </>
  )
}
