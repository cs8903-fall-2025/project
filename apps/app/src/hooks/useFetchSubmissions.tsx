import { useLiveQuery, eq } from '@tanstack/react-db'
import { getSubmissionsCollection } from '../collections/submissions'

export function useFetchSubmissions({
  assessmentId,
}: {
  assessmentId: string
}) {
  const { data: submissions } = useLiveQuery(
    (q) => {
      return q
        .from({ submission: getSubmissionsCollection() })
        .where(({ submission }) => eq(submission.assessmentId, assessmentId))
    },
    [assessmentId],
  )
  return submissions
}
