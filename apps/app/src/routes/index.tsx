import { createFileRoute, Link } from '@tanstack/react-router'

import { useFetchAssessments } from '../hooks/useFetchAssessments'

import { EllipsisVertical } from 'lucide-react'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { count } from '@/lib/text'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const assessments = useFetchAssessments()
  return (
    <ul className="grid grid-cols-3 gap-4 auto-rows-max">
      {assessments.map((assessment) => (
        <li key={assessment.assessmentId}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{assessment.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary">
                  {count('question', 'questions', assessment.questions.length)}
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
                    <DropdownMenuItem>Archive</DropdownMenuItem>
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
  )
}
