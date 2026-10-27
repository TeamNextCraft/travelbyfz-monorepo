import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/departures/$departureId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/departures/$departureId/edit"!</div>
}
