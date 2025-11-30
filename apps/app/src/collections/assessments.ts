import { createCollection, type Collection } from '@tanstack/react-db'
import { rxdbCollectionOptions } from '@tanstack/rxdb-db-collection'

import { getDatabase } from '../lib/db'
import type { AssessmentDocType } from '../lib/db'

let collection: Collection<
  AssessmentDocType,
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  never,
  AssessmentDocType
> | null = null

export function initAssessmentsCollection() {
  if (!collection) {
    collection = createCollection(
      rxdbCollectionOptions({
        rxCollection: getDatabase().assessments,
        startSync: true,
      }),
    )
  }
  return collection
}

export function getAssessmentsCollection() {
  if (!collection) {
    throw new Error(
      'Assessments collection not initialized. Call initAssessmentsCollection first.',
    )
  }
  return collection
}
