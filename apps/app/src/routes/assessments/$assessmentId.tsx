import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useFetchAssessment } from '@/hooks/useFetchAssessment'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/assessments/$assessmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const assessment = useFetchAssessment({ assessmentId })

  if (!assessment) {
    return null
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex mb-3">
        <ol className="flex items-center space-x-4">
          <li>
            <div className="flex items-center">
              <Link
                to="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Assessments
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-5 shrink-0 text-gray-300 dark:text-gray-600"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                aria-current="page"
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                to={`/assessments/${assessmentId}`}
              >
                Submissions
              </Link>
            </div>
          </li>
        </ol>
      </nav>
      <article>
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg text-foreground font-semibold">
              {assessment.name}
            </h2>
            {assessment.description && (
              <p className="text-muted-foreground">{assessment.description}</p>
            )}
          </div>
          <div>
            <Button>Upload submission</Button>
          </div>
        </header>
      </article>
    </>
  )
}
