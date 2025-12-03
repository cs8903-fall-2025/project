import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router'
import { House, Slash } from 'lucide-react'
import { useFetchAssessment } from '@/hooks/useFetchAssessment'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/assessments/$assessmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const assessment = useFetchAssessment({ assessmentId })
  const matchRoute = useMatchRoute()
  const isOnNewSubmission = matchRoute({
    to: '/assessments/$assessmentId/submissions/new',
    params: { assessmentId },
  })

  if (!assessment) {
    return null
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex mb-3">
        <ol className="flex items-center space-x-1">
          <li>
            <div className="flex items-center">
              <House className="text-muted-foreground size-3" />
              <Link
                to="/"
                className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Assessments
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <Slash className="text-muted-foreground size-3" />
              <Link
                className="ml-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                to={`/assessments/${assessmentId}`}
                activeProps={{
                  className: 'font-semibold',
                  'aria-current': 'page',
                }}
                activeOptions={{ exact: true }}
              >
                Submissions
              </Link>
            </div>
          </li>
          {isOnNewSubmission && (
            <li>
              <div className="flex items-center">
                <Slash className="text-muted-foreground size-3" />
                <Link
                  className="ml-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  to={`/assessments/${assessmentId}/submissions/new`}
                  activeProps={{
                    className: 'font-semibold',
                    'aria-current': 'page',
                  }}
                >
                  Upload Submission
                </Link>
              </div>
            </li>
          )}
        </ol>
      </nav>
      <article>
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg text-foreground font-semibold">
              {assessment.name}
            </h2>
            {assessment.description && (
              <p className="text-muted-foreground">{assessment.description}</p>
            )}
          </div>
          {!isOnNewSubmission && (
            <div>
              <Button asChild>
                <Link to={`/assessments/${assessmentId}/submissions/new`}>
                  Upload submission
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
