import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useGetClient } from '@/hooks/clients/useQuery.client'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Mail, Phone, Building2 } from 'lucide-react'
import { breadcrumb } from '@/constants/breadcrumb'

export const Route = createFileRoute('/_protected/clients/$clientId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { clientId } = Route.useParams()
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs)
  const { data: client, isLoading: loading, error } = useGetClient(clientId)

  useEffect(() => {
    if (client) {
      const { label, path } = breadcrumb.client(clientId, client.name)
      setBreadcrumbs([
        { label: breadcrumb.clients.label, path: breadcrumb.clients.path },
        { label, path }
      ])
    }
  }, [client, clientId, setBreadcrumbs])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error instanceof Error ? error.message : 'Error al cargar el cliente'}</AlertDescription>
      </Alert>
    )
  }

  if (!client) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Cliente no encontrado</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 items-center">
      <div>
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <p className="text-muted-foreground">Detalles del cliente</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">{client.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{client.phone}</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground">ID</p>
            <p className="font-mono text-xs text-muted-foreground">{client.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
