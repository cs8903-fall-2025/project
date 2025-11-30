import {
  createRxDatabase,
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxCollection,
  type RxDatabase,
  type RxDocument,
  type RxJsonSchema,
} from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'

const assessmentsSchemaLiteral = {
  title: 'assessments schema',
  description: 'Assessments of students',
  version: 0,
  keyCompression: true,
  primaryKey: 'assessmentId',
  type: 'object',
  properties: {
    assessmentId: {
      type: 'string',
      maxLength: 100,
    },
    description: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    studentId: {
      type: 'string',
      maxLength: 100,
    },
  },
  required: ['assessmentId', 'name', 'studentId'],
  indexes: ['studentId'],
} as const

const assessmentSchemaTyped = toTypedRxJsonSchema(assessmentsSchemaLiteral)
export type AssessmentDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof assessmentSchemaTyped
>
export const assessmentSchema: RxJsonSchema<AssessmentDocType> =
  assessmentSchemaTyped
export type AssessmentDocument = RxDocument<AssessmentDocType>

export type AssessmentCollection = RxCollection<AssessmentDocType>

export type AppDatabaseCollections = {
  assessments: AssessmentCollection
}

export type AppDatabase = RxDatabase<AppDatabaseCollections>

let db: AppDatabase | null = null

export async function openDatabase() {
  if (db) {
    return db
  }

  const storage = getRxStorageDexie()

  const { DEV = false } = import.meta.env as unknown as { DEV?: boolean }

  if (DEV) {
    const { addRxPlugin } = await import('rxdb/plugins/core')
    const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode')
    addRxPlugin(RxDBDevModePlugin)
  }

  db = await createRxDatabase<AppDatabase>({
    name: 'appdb',
    storage: wrappedValidateAjvStorage({
      storage: wrappedKeyCompressionStorage({
        storage,
      }),
    }),
    multiInstance: true,
    eventReduce: true,
  })

  await db.addCollections({
    assessments: {
      schema: assessmentSchema,
    },
  })

  db.assessments.postInsert(function insertHook(
    this: AssessmentCollection,
    _docData: AssessmentDocType,
    doc: AssessmentDocument,
  ) {
    console.log('insert to ' + this.name + '-collection: ' + doc.name)
  }, false)

  /**
   * Test insert
   *
  const assessment = await db.assessments.insert({
    assessmentId: '123',
    name: 'My Assessment',
    studentId: '123',
  })
  */

  return db
}

export function getDatabase() {
  if (!db) {
    throw new Error('Cannot get database before it has been opened')
  }
  return db
}

export function closeDatabase() {
  if (!db) {
    return
  }

  return db.close()
}
