import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetchSubmissions } from '@/hooks/useFetchSubmissions'

export const Route = createFileRoute('/assessments/$assessmentId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const submissions = useFetchSubmissions({ assessmentId })
  console.log('submissions', submissions)

  return (
    <ul>
      {submissions.map((submission) => (
        <li key={submission.submissionId}>
          <Link
            to={`/assessments/${assessmentId}/submissions/${submission.submissionId}`}
          >
            {submission.studentId.trim() || 'Anonymous Student'}
          </Link>
        </li>
      ))}
    </ul>
  )
}
