import {
  createRxDatabase,
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type KeyFunctionMap,
  type RxCollection,
  type RxDatabase,
  type RxDocument,
  type RxJsonSchema,
} from 'rxdb'
import { addRxPlugin } from 'rxdb/plugins/core'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'

const assessmentSchemaLiteral = {
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
    archived: {
      type: 'boolean',
    },
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
          },
          answer: {
            type: 'string',
          },
          rules: {
            type: 'string',
          },
          points: {
            type: 'number',
          },
        },
      },
    },
  },
  required: ['assessmentId', 'name', 'questions'],
} as const

export const assessmentSchemaTyped = toTypedRxJsonSchema(
  assessmentSchemaLiteral,
)

export type AssessmentDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof assessmentSchemaTyped
>

export const assessmentSchema: RxJsonSchema<AssessmentDocType> =
  assessmentSchemaLiteral
export type AssessmentDocument = RxDocument<AssessmentDocType>

export type AssessmentDocumentMethods = KeyFunctionMap

export type AssessmentCollectionMethods = KeyFunctionMap

export type AssessmentCollection = RxCollection<
  AssessmentDocType,
  AssessmentDocumentMethods,
  AssessmentCollectionMethods
>

const assessmentDocumentMethods: AssessmentDocumentMethods = {}
const assessmentCollectionMethods: AssessmentCollectionMethods = {}

const submissionSchemaLiteral = {
  title: 'submissions schema',
  description: 'Submissions from students',
  version: 0,
  keyCompression: true,
  primaryKey: 'submissionId',
  type: 'object',
  properties: {
    submissionId: {
      type: 'string',
      maxLength: 100,
    },
    studentId: {
      type: 'string',
    },
    assessmentId: {
      type: 'string',
      maxLength: 100,
    },
    files: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
        },
      },
    },
  },
  indexes: ['assessmentId'],
  required: ['submissionId', 'studentId', 'assessmentId', 'files'],
} as const

export const submissionSchemaTyped = toTypedRxJsonSchema(
  submissionSchemaLiteral,
)

export type SubmissionDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof submissionSchemaTyped
>

export const submissionSchema: RxJsonSchema<SubmissionDocType> =
  submissionSchemaLiteral
export type SubmissionDocument = RxDocument<SubmissionDocType>

export type SubmissionDocumentMethods = KeyFunctionMap
export type SubmissionCollectionMethods = KeyFunctionMap

export type SubmissionCollection = RxCollection<
  SubmissionDocType,
  SubmissionDocumentMethods,
  SubmissionCollectionMethods
>

const submissionDocumentMethods: SubmissionDocumentMethods = {}
const submissionCollectionMethods: SubmissionCollectionMethods = {}

export type AppDatabaseCollections = {
  assessments: AssessmentCollection
  submissions: SubmissionCollection
}

export type AppDatabase = RxDatabase<AppDatabaseCollections>

let db: AppDatabase | null = null

export async function openDatabase() {
  if (db) {
    return db
  }

  const storage = getRxStorageDexie()

  const { DEV = false } = import.meta.env as unknown as { DEV?: boolean }

  addRxPlugin(RxDBQueryBuilderPlugin)
  if (DEV) {
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
      methods: assessmentDocumentMethods,
      statics: assessmentCollectionMethods,
    },
    submissions: {
      schema: submissionSchema,
      methods: submissionDocumentMethods,
      statics: submissionCollectionMethods,
    },
  })

  /**
   * Verify insert
   *
  db.assessments.postInsert(function insertHook(
    this: AssessmentCollection,
    _docData: AssessmentDocType,
    doc: AssessmentDocument,
  ) {
    console.log('insert to ' + this.name + '-collection: ' + doc.name)
  }, false)
  */

  /**
   * Test insert
   *
  const assessment = await db.assessments.insert({
    assessmentId: crypto.randomUUID(),
    name: 'My Assessment',
    studentId: crypto.randomUUID(),
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
