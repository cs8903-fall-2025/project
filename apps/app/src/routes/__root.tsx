import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <header className="bg-primary py-3 px-6 flex items-center space-between">
        <img
          src="/logo-round.png"
          alt="Logo"
          className="h-14 w-14 rounded-full mr-2 border-2 border-white"
        />
        <h1 className="text-primary-foreground text-lg font-semibold flex-1">
          Owligent
        </h1>
        <nav className="text-primary-foreground p-2 flex gap-4 items-center">
          <Button
            asChild
            variant="link"
            className="text-primary-foreground hover:text-primary-foreground"
          >
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Assessments
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="border-white border bg-transparent hover:bg-blue-800 text-primary-foreground hover:text-primary-foreground"
          >
            <Link
              to="/assessments/new"
              activeProps={{
                className: 'font-bold',
              }}
            >
              <Plus aria-hidden="true" />
              New Assessment
            </Link>
          </Button>
        </nav>
      </header>
      <main className="py-8 px-6">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
