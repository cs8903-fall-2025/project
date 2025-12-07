import { useLiveQuery, eq } from '@tanstack/react-db'
import { getSubmissionsCollection } from '../collections/submissions'

export function useFetchSubmission({ submissionId }: { submissionId: string }) {
  const { data: submissions } = useLiveQuery(
    (q) => {
      return q
        .from({ submission: getSubmissionsCollection() })
        .where(({ submission }) => eq(submission.submissionId, submissionId))
        .findOne()
    },
    [submissionId],
  )
  return submissions
}
