import React, { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Dropzone from 'shadcn-dropzone'
import { Image, Trash } from 'lucide-react'

// import { runOCR } from '@/lib/ocr'
import { initOcrEngine } from '@/lib/ocr-enhanced'

const fileExtension = (file: File) => file.name.split('.').pop()
const fileSizeInKB = (file: File) => (file.size / 1024).toFixed(2)

export const Route = createFileRoute(
  '/assessments/$assessmentId/submissions/new',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const [extractions, setExtractions] = useState<
    { file: File; text: string; questionNumber: number }[]
  >([])
  const [files, setFiles] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)

  function handleDrop(acceptedFiles: File[]) {
    setFiles([...files, ...acceptedFiles])
  }

  async function handleUpload() {
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

  /**
  async function handleUpload() {
    setIsExtracting(true)
    const results = await Promise.all(
      files.map((file, index) => {
        return new Promise((resolve) => {
          runOCR(file).then((text) =>
            resolve({ file, text, questionNumber: index + 1 }),
          )
        }) as Promise<{ file: File; text: string; questionNumber: number }>
      }),
    ).finally(() => setIsExtracting(false))
    setExtractions(results)
  }
  */

  if (!extractions.length) {
    return (
      <div className="space-y-6">
        <Dropzone onDrop={handleDrop} />
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
          <Button onClick={handleUpload} disabled={isExtracting}>
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
              <Textarea className="max-w-3/4 w-full">{text}</Textarea>
            </div>
          </div>
        </React.Fragment>
      ))}
      <Button>Grade</Button>
    </div>
  )
}
