import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cancellation-policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cancellation-policy"!</div>
}
