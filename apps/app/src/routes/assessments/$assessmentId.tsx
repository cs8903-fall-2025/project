import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useFetchAssessment } from '@/hooks/useFetchAssessment'

import { Button } from '@/components/ui/button'
import { House, Slash } from 'lucide-react'

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
                aria-current="page"
                className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
