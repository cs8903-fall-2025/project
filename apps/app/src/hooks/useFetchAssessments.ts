import { useLiveQuery } from '@tanstack/react-db'
import { getAssessmentsCollection } from '../collections/assessments'

export function useFetchAssessments() {
  const { data: assessments } = useLiveQuery((q) => {
    return q
      .from({ assessments: getAssessmentsCollection() })
      .orderBy(({ assessments }) => {
        return assessments.name
      }, 'desc')
  })
  return assessments
}
