import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/domestic/offers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/domestic/offers"!</div>
}
