import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router'
import { Archive, ClipboardList } from 'lucide-react'
import { useFetchAssessment } from '@/hooks/useFetchAssessment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/assessments/$assessmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId, submissionId } = Route.useParams()
  const assessment = useFetchAssessment({ assessmentId })
  const matchRoute = useMatchRoute()
  const isOnAssessment = matchRoute({
    to: '/assessments/$assessmentId',
    params: { assessmentId },
  })
  const isOnSubmission = matchRoute({
    to: '/assessments/$assessmentId/submissions/$submissionId',
    params: { assessmentId, submissionId },
  })
  const isOnNewSubmission = matchRoute({
    to: '/assessments/$assessmentId/submissions/new',
    params: { assessmentId },
  })

  if (!assessment) {
    return null
  }

  return (
    <>
      <article>
        <header className="border-b border-b-gray-200 flex items-center justify-between pb-4 mb-8">
          <div>
            <h2 className="text-lg text-foreground font-semibold">
              {assessment.name}
            </h2>
            <Badge variant={assessment.archived ? 'destructive' : 'secondary'}>
              {assessment.archived ? <Archive /> : <ClipboardList />}
              {assessment.archived ? 'Archived' : 'Active'}
            </Badge>
          </div>
          {isOnAssessment && (
            <div>
              <Button asChild>
                <Link to={`/assessments/${assessmentId}/submissions/new`}>
                  Upload submission
                </Link>
              </Button>
            </div>
          )}
          {isOnSubmission && !isOnNewSubmission && (
            <div>
              <Button variant="outline" asChild>
                <Link to={`/assessments/${assessmentId}/submissions/new`}>
                  Upload another submission
                </Link>
              </Button>
            </div>
          )}
        </header>
        <div>
          <Outlet />
        </div>
      </article>
    </>
  )
}
