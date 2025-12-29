import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardStats } from "@/hooks/dashboard/useQuery.dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, BarChart3, Calendar, Key, Package, TrendingUp, UserCheck, Users } from "lucide-react";

export const Route = createFileRoute("/_protected/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No hay datos disponibles</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500",
      APPROVED: "bg-blue-500",
      INACTIVE: "bg-gray-500",
      PENDING: "bg-yellow-500",
      REJECTED: "bg-red-500",
      EXPIRED: "bg-orange-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "Activas",
      APPROVED: "Aprobadas",
      INACTIVE: "Inactivas",
      PENDING: "Pendientes",
      REJECTED: "Rechazadas",
      EXPIRED: "Expiradas",
    };
    return labels[status] || status;
  };

  const totalKeysByStatus = stats.keys_by_status.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reportes y Estadísticas
          </h1>
          <p className="text-muted-foreground mt-1">Vista general del sistema y métricas clave</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_clients}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.active_clients} activos</p>
          </CardContent>
        </Card>

        {/* Total Keys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Llaves</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_keys}</div>
            <p className="text-xs text-muted-foreground mt-1">Todas las licencias</p>
          </CardContent>
        </Card>

        {/* Total Batches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lotes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_batches}</div>
            <p className="text-xs text-muted-foreground mt-1">Grupos de licencias</p>
          </CardContent>
        </Card>

        {/* Keys Expiring */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas a Vencer</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.keys_expiring_month}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution and Recent Batches */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Keys by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Distribución por Estado
            </CardTitle>
            <CardDescription>Estado actual de todas las llaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.keys_by_status.map((item) => {
              const percentage = totalKeysByStatus > 0 ? ((item.count / totalKeysByStatus) * 100).toFixed(1) : "0";

              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>{getStatusLabel(item.status)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.count}</span>
                      <span className="text-muted-foreground">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getStatusColor(item.status)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Batches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lotes Recientes
            </CardTitle>
            <CardDescription>Últimos lotes creados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_batches.length > 0 ? (
                stats.recent_batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{batch.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(batch.created_at), "dd MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {batch.quantity} llaves
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No hay lotes recientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Active Clients Ratio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Tasa de Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {stats.total_clients > 0 ? ((stats.active_clients / stats.total_clients) * 100).toFixed(1) : "0"}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.active_clients} de {stats.total_clients} clientes
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${stats.total_clients > 0 ? (stats.active_clients / stats.total_clients) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keys per Client */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Promedio por Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {stats.total_clients > 0 ? (stats.total_keys / stats.total_clients).toFixed(1) : "0"}
              </div>
              <p className="text-xs text-muted-foreground">Llaves por cliente</p>
            </div>
          </CardContent>
        </Card>

        {/* Keys per Batch */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Promedio por Lote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {stats.total_batches > 0 ? (stats.total_keys / stats.total_batches).toFixed(1) : "0"}
              </div>
              <p className="text-xs text-muted-foreground">Llaves por lote</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen General</CardTitle>
          <CardDescription>Vista consolidada del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
              <p className="text-2xl font-bold">{stats.total_users}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Clientes Registrados</p>
              <p className="text-2xl font-bold">{stats.total_clients}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Licencias Totales</p>
              <p className="text-2xl font-bold">{stats.total_keys}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lotes Creados</p>
              <p className="text-2xl font-bold">{stats.total_batches}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
