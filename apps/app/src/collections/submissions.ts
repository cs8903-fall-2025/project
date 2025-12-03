import { createCollection, type Collection } from '@tanstack/react-db'
import { rxdbCollectionOptions } from '@tanstack/rxdb-db-collection'

import { getDatabase } from '../lib/db'
import type { SubmissionDocType } from '../lib/db'

let collection: Collection<
  SubmissionDocType,
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  never,
  SubmissionDocType
> | null = null

export function initSubmissionsCollection() {
  if (!collection) {
    collection = createCollection(
      rxdbCollectionOptions({
        rxCollection: getDatabase().submissions,
        startSync: true,
      }),
    )
  }
  return collection
}

export function getSubmissionsCollection() {
  if (!collection) {
    throw new Error(
      'Submissions collection not initialized. Call initSubmissionsCollection first.',
    )
  }
  return collection
}
