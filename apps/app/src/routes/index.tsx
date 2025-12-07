import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { getAssessmentsCollection } from '@/collections/assessments'
import { useFetchAssessments } from '@/hooks/useFetchAssessments'

import {
  Archive,
  ClipboardList,
  EllipsisVertical,
  Files,
  Funnel,
  MessageCircleQuestionMark,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { count } from '@/lib/text'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [archiveStatus, setArchiveStatus] = useState<string>('Open')
  const assessments = useFetchAssessments({
    archived: archiveStatus === 'Archived',
  })
  const assessmentsCollection = useMemo(getAssessmentsCollection, [])

  function archive(id: string) {
    assessmentsCollection.update(id, (draft) => {
      draft.archived = true
    })
    toast.success('Assessment archived.')
  }

  function unarchive(id: string) {
    assessmentsCollection.update(id, (draft) => {
      draft.archived = false
    })
    toast.success('Assessment re-opened!')
  }

  return (
    <>
      <div className="border-b border-b-gray-200 flex items-baseline space-between w-full pb-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl text-gray-900 font-semibold">Assessments</h2>
          <Badge
            variant={archiveStatus === 'Archived' ? 'destructive' : 'secondary'}
          >
            {archiveStatus === 'Archived' ? <Archive /> : <ClipboardList />}
            {archiveStatus}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Funnel aria-hidden="true" />
              Filter assessments
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" hideWhenDetached>
            <DropdownMenuRadioGroup
              value={archiveStatus}
              onValueChange={setArchiveStatus}
            >
              <DropdownMenuRadioItem value="Open">Open</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Archived">
                Archived
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {assessments.length === 0 && (
        <div
          className={
            archiveStatus === 'Archived'
              ? `bg-red-50 rounded-2xl border border-dashed border-red-200 w-1/3 mx-auto p-6 text-center`
              : `bg-blue-50 rounded-2xl border border-dashed border-blue-200 w-1/3 mx-auto p-6 text-center`
          }
        >
          {archiveStatus === 'Archived' ? (
            <Archive size={96} className="mx-auto text-red-900" />
          ) : (
            <Files size={96} className="mx-auto text-blue-900" />
          )}
          <p
            className={
              archiveStatus === 'Archived'
                ? 'text-center text-red-800 mt-4'
                : 'text-center text-blue-800 mt-4'
            }
          >
            No {archiveStatus === 'Archived' ? 'archived' : ''} assessments
            found.
          </p>
          {archiveStatus === 'Open' && (
            <Button asChild className="mt-6">
              <Link to="/assessments/new">Create your first</Link>
            </Button>
          )}
        </div>
      )}
      {assessments.length > 0 && (
        <ul className="grid grid-cols-3 gap-4 auto-rows-max">
          {assessments.map((assessment) => (
            <li key={assessment.assessmentId}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="hover:underline">
                    <Link to={`/assessments/${assessment.assessmentId}`}>
                      {assessment.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-6 flex-start">
                    <span className="flex items-center gap-1">
                      <MessageCircleQuestionMark
                        size="18"
                        className="inline-block text-green-600"
                      />{' '}
                      {count(
                        'question',
                        'questions',
                        assessment.questions.length,
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy
                        size="18"
                        className="inline-block text-yellow-600"
                      />{' '}
                      {count(
                        'point',
                        'points',
                        assessment.questions.reduce(
                          (accumulator, { points = 0 }) => {
                            return accumulator + points
                          },
                          0,
                        ),
                      )}
                    </span>
                  </CardDescription>
                  <CardAction className="flex items-center gap-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Archive"
                          className="-mt-2"
                        >
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/assessments/${assessment.assessmentId}`}>
                            View submissions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/assessments/${assessment.assessmentId}/submissions/new`}
                          >
                            New submission
                          </Link>
                        </DropdownMenuItem>
                        {assessment.archived && (
                          <DropdownMenuItem
                            onClick={() => unarchive(assessment.assessmentId)}
                          >
                            Re-open
                          </DropdownMenuItem>
                        )}
                        {!assessment.archived && (
                          <DropdownMenuItem
                            onClick={() => archive(assessment.assessmentId)}
                          >
                            Archive
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
