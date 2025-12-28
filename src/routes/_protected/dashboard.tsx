import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, FolderOpen, Key, Package, TrendingUp, Users } from "lucide-react";
import { useGetDashboardStats } from "@/hooks/dashboard/useQuery.dashboard";
import { statusColors, statusLabels } from "@/lib/status";
import { Badge } from "@/components/ui/badge";
import type { StatusEnum } from "@/services/enum.schema";

export const Route = createFileRoute("/_protected/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Cargando estadísticas...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen general del sistema de licencias</p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_clients || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.active_clients || 0} con licencias activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Licencias</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_keys || 0}</div>
            <p className="text-xs text-muted-foreground">licencias registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lotes</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_batches || 0}</div>
            <p className="text-xs text-muted-foreground">lotes creados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiran este mes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.keys_expiring_month || 0}</div>
            <p className="text-xs text-muted-foreground">licencias próximas a vencer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución de licencias por estado */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribución de Licencias por Estado</CardTitle>
            <CardDescription>Estado actual de todas las licencias en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats?.keys_by_status && stats.keys_by_status.length > 0 ? (
                stats.keys_by_status.map((statusCount) => {
                  const status = statusCount.status as StatusEnum;
                  return (
                    <div key={statusCount.status} className="flex flex-col items-center p-4 rounded-lg border">
                      <Badge className={statusColors[status]} variant="outline">
                        {statusLabels[status] || statusCount.status}
                      </Badge>
                      <span className="text-3xl font-bold mt-2">{statusCount.count}</span>
                      <span className="text-xs text-muted-foreground">licencias</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-5 text-center py-8">
                  <p className="text-muted-foreground">No hay datos de licencias disponibles</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usuarios del sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
            <CardDescription>Información general del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Usuarios</span>
              </div>
              <span className="text-2xl font-bold">{stats?.total_users || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Clientes Activos</span>
              </div>
              <span className="text-2xl font-bold">{stats?.active_clients || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Tasa de Uso</span>
              </div>
              <span className="text-2xl font-bold">
                {stats?.total_clients && stats.active_clients
                  ? `${Math.round((stats.active_clients / stats.total_clients) * 100)}%`
                  : "0%"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lotes recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lotes Recientes</CardTitle>
          <CardDescription>Últimos lotes de licencias creados</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recent_batches && stats.recent_batches.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_batches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/batchs/${batch.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{batch.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(batch.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{batch.quantity} licencias</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay lotes creados aún</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
