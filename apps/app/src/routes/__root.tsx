import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
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
      <main className="mx-auto max-w-7xl py-6 px-6">
        <Outlet />
      </main>
      <Toaster position="top-center" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
