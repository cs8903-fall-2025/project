import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { SortableItem } from '@/components/ui/sortable-item'
import { Textarea } from '@/components/ui/textarea'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { getAssessmentsCollection } from '@/collections/assessments'

export const Route = createFileRoute('/assessments/new')({
  component: RouteComponent,
})

const formSchema = z.object({
  archived: z.boolean(),
  assessmentId: z.string().max(100),
  name: z.string().min(2).max(255),
  description: z.string(),
  questions: z
    .array(
      z.object({
        question: z.string().min(2),
        answer: z.string().min(2),
        rules: z.string().min(2),
        points: z.number(),
      }),
    )
    .min(1),
})

type FormSchema = z.infer<typeof formSchema>

function RouteComponent() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormSchema, any, FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      archived: false,
      assessmentId: crypto.randomUUID() as string,
      name: '',
      description: '',
      questions: [
        {
          question: '',
          answer: '',
          rules: '',
          points: 1,
        },
      ],
    },
  })
  const { fields, insert, remove, move } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function addQuestion(index: number) {
    insert(index + 1, {
      question: '',
      answer: '',
      rules: '',
      points: 1,
    })
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = fields.findIndex((field) => field.id === active.id)
    const newIndex = fields.findIndex((field) => field.id === over.id)
    move(oldIndex, newIndex)
  }

  function onSubmit(values: FormSchema) {
    const assessments = getAssessmentsCollection()
    // TODO: Handle errors
    assessments.insert(values)
    navigate({
      to: '/',
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-2 py-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="GEO-100 Fall 2026 Final Exam" {...field} />
              </FormControl>
              <FormDescription>
                Use a unique name for your assessment. A good practice is to
                include the course code, term, and type of assessment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Optionally provide context to assisst with grading this
                assignment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={fields}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {fields.map((field, index) => (
                <SortableItem
                  className="bg-gray-100 space-y-6 px-2 py-4 rounded-lg"
                  key={field.id}
                  id={field.id}
                >
                  <FormField
                    control={form.control}
                    name={`questions.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question {index + 1}</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.rules`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grading instructions</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.points`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white"
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addQuestion(index)}
                    >
                      Add another
                    </Button>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                        className="ml-auto"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Button type="submit">Create assessment</Button>
      </form>
    </Form>
  )
}
