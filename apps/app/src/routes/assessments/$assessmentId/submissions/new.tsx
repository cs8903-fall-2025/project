import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Dropzone from 'shadcn-dropzone'
import { Image, Trash } from 'lucide-react'

import { initOcrEngine } from '@/lib/ocr-enhanced'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { getAssessmentsCollection } from '@/collections/assessments'
import { getSubmissionsCollection } from '@/collections/submissions'

export const Route = createFileRoute(
  '/assessments/$assessmentId/submissions/new',
)({
  component: RouteComponent,
})

const fileExtension = (file: File) => file.name.split('.').pop()
const fileSizeInKB = (file: File) => (file.size / 1024).toFixed(2)

const formSchema = z.object({
  assessmentId: z.string().max(100),
  studentId: z.string().max(100),
  submissionId: z.string().max(100),
})
type FormSchema = z.infer<typeof formSchema>

function RouteComponent() {
  const { assessmentId } = Route.useParams() as { assessmentId: string }
  const [extractions, setExtractions] = useState<
    { file: File; text: string; questionNumber: number }[]
  >([])
  const [files, setFiles] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [modelStatus, setModelStatus] = useState<string>('')

  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormSchema, any, FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentId,
      studentId: '',
      submissionId: crypto.randomUUID() as string,
    },
  })

  async function onSubmit(values: FormSchema) {
    setIsExtracting(true)

    // @ts-expect-error window.LanguageModel types
    const availability = (await window.LanguageModel.availability({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
    })) as 'unavailable' | 'downloadable' | 'downloading' | 'available'
    if (availability === 'unavailable') {
      alert(
        'Language model is unavailable. Please use the latest version of Google Chrome.',
      )
      setIsExtracting(false)
      return
    } else if (availability !== 'available') {
      setModelStatus(
        'Downloading language model... Grading may take longer than usual.',
      )
    }

    const files = await Promise.all(
      extractions.map(({ file, text }) => {
        return new Promise<{ image: string; text: string }>((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            resolve({
              image: typeof reader.result === 'string' ? reader.result : '',
              text,
            })
          }
        })
      }),
    )

    // @ts-expect-error window.LanguageModel types
    const session = await window.LanguageModel.create({
      initialPrompts: [
        {
          role: 'system',
          content:
            'You are a helpful, harmless teacher chatbot that helps grade student submissions based on the questions provided.',
        },
      ],
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
      // @ts-expect-error monitor types
      monitor(m) {
        if (availability !== 'available') {
          // @ts-expect-error downloadprogress types
          m.addEventListener('downloadprogress', (e) => {
            setModelStatus(
              `Downloaded ${e.loaded * 100}% of the language model...`,
            )
          })
        }
      },
    })

    const assessments = getAssessmentsCollection()
    const assessment = assessments.get(assessmentId)

    if (!assessment) {
      alert('Assessment not found.')
      setIsExtracting(false)
      return
    }

    const questions = await Promise.all(
      assessment.questions.map((q) => {
        const schema = {
          type: 'object',
          required: ['answer', 'pointsAwarded', 'feedback'],
          additionalProperties: false,
          properties: {
            answer: { type: 'string' },
            pointsAwarded: {
              type: 'number',
              minimum: 0,
              maximum: q.points ?? 0,
            },
            feedback: { type: 'string' },
          },
        }
        return new Promise<{
          answer: string
          pointsAwarded: number
          feedback: string
        }>((resolve) => {
          session
            .prompt(
              `Grade the following question based and award it points based on the rules provided:

              Question: ${q.question}

              Maximum points: ${q.points}

              Rules: ${q.rules}

              Find the answer to the question in the following text:

              ${files.map((f) => f.text).join('\n\n')}`,
              { responseConstraint: schema },
            )
            // @ts-expect-error expectedInputs types
            .then((result) => {
              resolve(JSON.parse(result))
            })
            .catch((err: unknown) => {
              console.error(err)
            })
        })
      }),
    )

    const submissions = getSubmissionsCollection()
    // TODO: Handle errors
    submissions.insert({
      ...values,
      files,
      questions: questions.map((q, i) => ({
        question: assessment.questions[i].question,
        answer: q.answer,
        points: assessment.questions[i].points,
        pointsAwarded: q.pointsAwarded,
        feedback: q.feedback,
        needsReview: false,
      })),
    })
    navigate({
      to: `/assessments/${assessmentId}/submissions/${values.submissionId}`,
    })
  }

  function onDrop(acceptedFiles: File[]) {
    setFiles([...files, ...acceptedFiles])
  }

  async function onUpload() {
    setIsExtracting(true)
    const engine = await initOcrEngine()

    const results = await Promise.all(
      files.map(
        async (
          file,
          index,
        ): Promise<{ file: File; text: string; questionNumber: number }> => {
          return new Promise((resolve) => {
            createImageBitmap(file).then((bitmap) => {
              let text = ''
              const canvas = document.createElement('canvas')
              canvas.width = bitmap.width
              canvas.height = bitmap.height
              const ctx = canvas.getContext('2d')
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0)
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const image = engine.loadImage(
                  data.width,
                  data.height,
                  new Uint8Array(data.data),
                )
                text = engine.getText(image)
              }
              resolve({ file, text, questionNumber: index + 1 })
            })
          })
        },
      ),
    )

    setExtractions(results)
    setIsExtracting(false)
  }

  if (!extractions.length) {
    return (
      <div className="space-y-6">
        <Dropzone onDrop={onDrop} />
        <ul className="space-y-3">
          {files.map((file, index) => (
            <li key={index}>
              <div className="border-secondary border flex items-center gap-2 max-w-96 px-2 py-3 rounded-sm">
                <Image />
                <div>
                  <div className="truncate text-sm">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {fileExtension(file)} &middot; {fileSizeInKB(file)}KB
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Delete"
                  className="rounded-full"
                >
                  <Trash />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <Button onClick={onUpload} disabled={isExtracting}>
            {isExtracting ? 'Processing...' : 'Process files'}
          </Button>
          <Button asChild variant="link">
            <Link to={`/assessments/${assessmentId}`}>cancel</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Ready to Grade</h2>
        <p className="text-muted-foreground">
          Review the submission and then grade it.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-2 py-4"
          id="submission"
        >
          <FormLabel>Student ID or name</FormLabel>
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter the student's name or ID for this submission.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {extractions.map(({ file, text, questionNumber }, index) => (
        <React.Fragment
          key={`${file.lastModified}-${file.name}-${file.size}-${file.type}`}
        >
          <div className="flex items-start w-full gap-6">
            <img
              src={URL.createObjectURL(file)}
              alt={`Extraction #${index + 1}`}
              className="border max-w-1/4 object-contain rounded shrink"
            />
            <div className="grow">
              <Label>Question {questionNumber}</Label>
              <Textarea className="max-w-3/4 w-full" defaultValue={text} />
            </div>
          </div>
        </React.Fragment>
      ))}
      <Button form="submission" disabled={isExtracting}>
        {isExtracting ? 'Grading...' : 'Grade submission'}
      </Button>
      {isExtracting && modelStatus && (
        <div className="text-sm text-muted-foreground">{modelStatus}</div>
      )}
    </div>
  )
}
