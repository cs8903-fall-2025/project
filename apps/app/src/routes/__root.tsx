import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <header className="bg-accent py-3 px-6 flex items-center space-between">
        <h1 className="text-primary text-lg font-semibold flex-1">
          AutoGrader
        </h1>
        <nav className="p-2 flex gap-2">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Assessments
          </Link>{' '}
          <Link
            to="/assessments/new"
            activeProps={{
              className: 'font-bold',
            }}
          >
            New Assessment
          </Link>
        </nav>
      </header>
      <main className="py-8 px-6">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
