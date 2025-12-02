import { useLiveQuery, eq } from '@tanstack/react-db'
import { getAssessmentsCollection } from '../collections/assessments'

export function useFetchAssessments({ archived }: { archived: boolean }) {
  console.log('archived', archived)
  const { data: assessments } = useLiveQuery(
    (q) => {
      return q
        .from({ assessment: getAssessmentsCollection() })
        .where(({ assessment }) => eq(assessment.archived, archived))
        .orderBy(({ assessment }) => {
          return assessment.name
        }, 'desc')
    },
    [archived],
  )
  return assessments
}
