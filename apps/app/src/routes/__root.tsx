import { useEffect, useState } from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [aiStatus, setAiStatus] = useState<
    'unavailable' | 'available' | 'downloading' | 'downloadable'
  >('available')
  const [progress, setProgress] = useState(0)

  async function checkAiStatus() {
    // @ts-expect-error window.LanguageModel types
    if (!window.LanguageModel?.availability) {
      setAiStatus('unavailable')
      return
    }

    // @ts-expect-error window.LanguageModel types
    const availability = (await window.LanguageModel.availability({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
    })) as 'unavailable' | 'downloadable' | 'downloading' | 'available'
    setAiStatus(availability)
  }

  async function downloadAiModel() {
    setAiStatus('downloading')

    // @ts-expect-error window.LanguageModel types
    const session = await window.LanguageModel.create({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
      // @ts-expect-error monitor types
      monitor(m) {
        // @ts-expect-error downloadprogress types
        m.addEventListener('downloadprogress', (e) => {
          setProgress(e.loaded)

          if (e.loaded >= 1) {
            toast.success('AI model downloaded successfully!')
          }
        })
      },
    })
    setProgress(1)
    session.destroy()
  }

  useEffect(() => {
    void checkAiStatus()
  }, [])

  return (
    <>
      {aiStatus === 'unavailable' && (
        <div className="bg-red-600 text-red-50 text-center text-sm p-2">
          AI not available. Grading will not work. Use Google Chrome.{' '}
          <a
            className="underline"
            href="https://developer.chrome.com/docs/ai/get-started#user-activation"
          >
            Troubleshooting
          </a>
        </div>
      )}
      {aiStatus === 'downloadable' && (
        <div className="bg-yellow-600 text-yellow-50 text-center text-sm p-2">
          AI model is {aiStatus}.{' '}
          <button type="button" className="underline" onClick={downloadAiModel}>
            Download now
          </button>{' '}
          to use offline
        </div>
      )}
      {aiStatus === 'downloading' && (
        <div className="bg-blue-100 text-blue-600 text-center text-sm p-2 flex items-center justify-center">
          <span>AI model is downloading...</span>{' '}
          <Progress value={progress * 100} className="ml-2 w-48" />
        </div>
      )}
      <header className="bg-primary">
        <div className="mx-auto max-w-7xl flex items-center space-between py-3 px-6">
          <img
            src="/logo-round.png"
            alt="Logo"
            className="h-14 w-14 rounded-full mr-2 border-2 border-white"
          />
          <h1 className="text-primary-foreground text-xl font-semibold flex-1">
            Owligent
          </h1>
          <nav className="text-primary-foreground p-2 flex gap-4 items-center">
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Assessments
            </Link>
            <Link
              to="/assessments/new"
              activeProps={{
                className: 'font-bold',
              }}
            >
              New Assessment
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-6 px-6 grow w-full">
        <Outlet />
      </main>
      <footer className="mt-4 px-6">
        <small className="block border-t border-gray-200 my-4 mx-auto max-w-7xl py-4 text-center text-sm text-muted-foreground w-full">
          This is a proof of concept application developed for educational and
          research purposes only. It is not intended for production use. Learn
          more{' '}
          <a
            className="underline"
            href="https://cs8903-odc-website.nkenyeres3.workers.dev"
          >
            about this project
          </a>
          .
        </small>
      </footer>
      <Toaster position="top-center" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
