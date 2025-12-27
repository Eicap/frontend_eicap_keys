import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/client/$clientId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/client/$clientId"!</div>
}
