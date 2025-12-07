import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetchSubmissions } from '@/hooks/useFetchSubmissions'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculateGrade } from '@/lib/grade'

export const Route = createFileRoute('/assessments/$assessmentId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const submissions = useFetchSubmissions({ assessmentId })

  return (
    <Table>
      <TableCaption>A list of student submissions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Submission ID</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => {
          const { totalPoints, totalPointsAwarded, grade } = calculateGrade(
            submission.questions,
          )
          return (
            <TableRow key={submission.submissionId}>
              <TableCell className="font-medium">
                {submission.submissionId}
              </TableCell>
              <TableCell>{submission.studentId}</TableCell>
              <TableCell>
                {totalPoints}/{totalPointsAwarded} ({grade})
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link
                    to={`/assessments/${assessmentId}/submissions/${submission.submissionId}`}
                  >
                    Review
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Number of submissions</TableCell>
          <TableCell className="text-right">{submissions.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
