import { useEffect } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Regster {
    router: typeof router
  }
}

export function App({ onDestroy }: { onDestroy: () => void }) {
  useEffect(() => onDestroy)

  return <RouterProvider router={router} />
}
