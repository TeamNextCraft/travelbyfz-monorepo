import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/domestic/tours/$tourId/book')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/domestic/tours/$tourId/book"!</div>
}
