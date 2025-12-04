import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import Dropzone from 'shadcn-dropzone'
import { Image, Trash } from 'lucide-react'

import { runOCR } from '@/lib/ocr'

const fileExtension = (file: File) => file.name.split('.').pop()
const fileSizeInKB = (file: File) => (file.size / 1024).toFixed(2)

export const Route = createFileRoute(
  '/assessments/$assessmentId/submissions/new',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { assessmentId } = Route.useParams()
  const [files, setFiles] = useState<File[]>([])

  function handleDrop(acceptedFiles: File[]) {
    setFiles([...files, ...acceptedFiles])
  }

  async function handleUpload() {
    files.forEach(async (file) => {
      const text = await runOCR(file)
      console.log(text)
    })
  }

  return (
    <div className="space-y-6">
      <Dropzone onDrop={handleDrop} />
      <ul className="space-y-3">
        {files.map((file) => (
          <li>
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
        <Button onClick={handleUpload}>Upload</Button>
        <Button asChild variant="link">
          <Link to={`/assessments/${assessmentId}`}>cancel</Link>
        </Button>
      </div>
    </div>
  )
}
