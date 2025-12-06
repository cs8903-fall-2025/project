import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetchSubmissions } from '@/hooks/useFetchSubmissions'

export const Route = createFileRoute('/assessments/$assessmentId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const submissions = useFetchSubmissions({ assessmentId })

  return (
    <ul>
      {submissions.map((submission) => (
        <li>
          <Link
            to={`/assessments/${assessmentId}/submissions/${submission.submissionId}`}
          >
            {submission.studentId}
          </Link>
        </li>
      ))}
    </ul>
  )
}
