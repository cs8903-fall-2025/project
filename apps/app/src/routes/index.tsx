import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { getAssessmentsCollection } from '@/collections/assessments'
import { useFetchAssessments } from '@/hooks/useFetchAssessments'

import { Archive, ClipboardList, EllipsisVertical, Funnel } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
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
  const [archiveStatus, setArchiveStatus] = useState<string>('Unarchived')
  const assessments = useFetchAssessments({
    archived: archiveStatus === 'Archived',
  })
  const assessmentsCollection = useMemo(getAssessmentsCollection, [])

  function archive(id: string) {
    assessmentsCollection.update(id, (draft) => {
      draft.archived = true
    })
  }

  function unarchive(id: string) {
    assessmentsCollection.update(id, (draft) => {
      draft.archived = false
    })
  }

  return (
    <>
      <div className="flex items-baseline space-between w-full">
        <div className="flex-1 mb-6">
          <h1 className="text-2xl text-gray-900 font-semibold">Assessments</h1>
          <Badge
            variant={archiveStatus === 'Archived' ? 'destructive' : 'secondary'}
          >
            {archiveStatus === 'Archived' ? <Archive /> : <ClipboardList />}
            {archiveStatus}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Funnel />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuRadioGroup
              value={archiveStatus}
              onValueChange={setArchiveStatus}
            >
              <DropdownMenuRadioItem value="Archived">
                Archived
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Unarchived">
                Unarchived
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="grid grid-cols-3 gap-4 auto-rows-max">
        {assessments.map((assessment) => (
          <li key={assessment.assessmentId}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{assessment.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">
                    {count(
                      'question',
                      'questions',
                      assessment.questions.length,
                    )}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100">
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
                  </Badge>
                </CardDescription>
                <CardAction className="flex items-center gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link to={`/assessments/${assessment.assessmentId}`}>
                      Submissions
                    </Link>
                  </Button>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Archive">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                      {assessment.archived && (
                        <DropdownMenuItem
                          onClick={() => unarchive(assessment.assessmentId)}
                        >
                          Unarchive
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
              <CardContent>
                <p className="text-balance text-gray-700">
                  {assessment.description}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
