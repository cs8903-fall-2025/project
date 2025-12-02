import { createFileRoute, Link } from '@tanstack/react-router'

import { useFetchAssessments } from '../hooks/useFetchAssessments'

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
              <CardAction>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/assessments/${assessment.assessmentId}`}>
                    View
                  </Link>
                </Button>
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
