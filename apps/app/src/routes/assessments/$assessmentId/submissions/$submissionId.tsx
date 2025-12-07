import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useFetchSubmission } from '@/hooks/useFetchSubmission'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSubmissionsCollection } from '@/collections/submissions'

export const Route = createFileRoute(
  '/assessments/$assessmentId/submissions/$submissionId',
)({
  component: RouteComponent,
})

const formSchema = z.object({
  questions: z.array(
    z.object({
      answer: z.string(),
      pointsAwarded: z.number().min(0),
      feedback: z.string().optional(),
      needsReview: z.boolean(),
    }),
  ),
})

type FormSchema = z.infer<typeof formSchema>

function RouteComponent() {
  const { assessmentId, submissionId } = Route.useParams()
  const submission = useFetchSubmission({ submissionId })

  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormSchema, any, FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [],
    },
  })
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  useEffect(() => {
    if (submission && !fields.length) {
      replace(
        submission.questions as {
          answer: string
          pointsAwarded: number
          feedback: string
          needsReview: boolean
        }[],
      )
    }
  }, [fields, replace, submission])

  function onSubmit(values: FormSchema) {
    const submissions = getSubmissionsCollection()
    // TODO: Handle errors
    submissions.update(submissionId, (draft) => {
      if (!submission || !submission.questions || !draft.questions) {
        return
      }
      draft.questions = submission.questions.map((q, i) => ({
        ...q,
        answer: values.questions[i].answer,
        pointsAwarded: values.questions[i].pointsAwarded,
        feedback: values.questions[i].feedback,
        needsReview: values.questions[i].needsReview,
      }))
    })
    navigate({
      to: `/assessments/${assessmentId}`,
    })
  }

  if (!submission) {
    return <div>Loading submission...</div>
  }

  if (!submission.questions) {
    return <div>Submission is invalid</div>
  }

  return (
    <article className="space-y-8">
      <header>
        <h2 className="text-3xl font-semibold">Student Submission</h2>
      </header>
      <section className="prose">
        <h3>Details</h3>
        <dl>
          <dt>Student ID:</dt>
          <dd>{submission.studentId}</dd>
        </dl>
      </section>
      <section className="prose max-w-none">
        <h3>Assessment</h3>
        <p>
          You can review and adjust the graded submission here. You may also
          view the OCR results.
        </p>
      </section>
      <Tabs defaultValue="assessments">
        <TabsList>
          <TabsTrigger value="ocr">OCR Results</TabsTrigger>
          <TabsTrigger value="assessments">Assessment</TabsTrigger>
        </TabsList>
        <TabsContent value="ocr"></TabsContent>
        <TabsContent value="assessments">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-2 py-4"
            >
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-6">
                  <p className="font-semibold">
                    {submission.questions?.[index]?.question}
                  </p>
                  <FormField
                    control={form.control}
                    name={`questions.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.feedback`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.pointsAwarded`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points Awarded</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            max={submission.questions?.[index]?.points}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormDescription>
                          out of {submission.questions?.[index]?.points}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.needsReview`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Needs Review?</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={`questions.${index}.needsReview`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              ))}
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </article>
  )
}
