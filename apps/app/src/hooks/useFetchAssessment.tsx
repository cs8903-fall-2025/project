import { useLiveQuery, eq } from '@tanstack/react-db'
import { getAssessmentsCollection } from '../collections/assessments'

export function useFetchAssessment({ assessmentId }: { assessmentId: string }) {
  const { data: assessments } = useLiveQuery(
    (q) => {
      return q
        .from({ assessment: getAssessmentsCollection() })
        .where(({ assessment }) => eq(assessment.assessmentId, assessmentId))
        .findOne()
    },
    [assessmentId],
  )
  return assessments
}
