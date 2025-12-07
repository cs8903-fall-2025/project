import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetchSubmissions } from '@/hooks/useFetchSubmissions'
import { count } from '@/lib/text'

import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
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
    <>
      <h3 className="text-lg mb-1">Submissions</h3>
      <p className="text-muted-foreground font-light mb-4">
        You've graded{' '}
        <strong>
          {count('submission', 'submissions', submissions.length)}
        </strong>{' '}
        for this assessment.
      </p>
      <div className="border border-gray-200 p-6 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell>{submission.submissionId}</TableCell>
                  <TableCell>{submission.studentId}</TableCell>
                  <TableCell>
                    {totalPoints}/{totalPointsAwarded} ({grade})
                  </TableCell>
                  <TableCell>
                    {submission.questions?.some((q) => q.needsReview) ? (
                      <Badge variant="destructive">Review</Badge>
                    ) : (
                      <Badge variant="secondary">Graded</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        to={`/assessments/${assessmentId}/submissions/${submission.submissionId}`}
                      >
                        <Search /> View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
