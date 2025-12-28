import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { breadcrumb } from "@/constants/breadcrumb";
import { useGetBatch } from "@/hooks/batchs/useQuery.batch";
import { statusColors, statusLabels } from "@/lib/status";
import type { StatusEnum } from "@/services/enum.schema";
import type { Key } from "@/services/key/key.schema";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Ban, Calendar, CheckCircle2, Clock, FileText, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_protected/batchs/$batchId")({
  component: RouteComponent,
});

const statusIcons: Record<StatusEnum, React.ReactNode> = {
  ACTIVE: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  INACTIVE: <XCircle className="h-5 w-5 text-gray-500" />,
  APPROVED: <CheckCircle2 className="h-5 w-5 text-blue-500" />,
  PENDING: <Clock className="h-5 w-5 text-yellow-500" />,
  EXPIRED: <Ban className="h-5 w-5 text-red-500" />,
};

function RouteComponent() {
  const { batchId } = Route.useParams();
  const { data: batch, isLoading } = useGetBatch(batchId);
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setBreadcrumbs([
      { label: breadcrumb.batchs.label, path: breadcrumb.batchs.path },
      { label: "Detalle del Lote", path: `/batchs/${batchId}` },
    ]);
  }, [setBreadcrumbs, batchId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Lote no encontrado</div>
      </div>
    );
  }

  const columns: ColumnDef<Key>[] = [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.code}</span>,
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.state;
        return (
          <Badge className={statusColors[status]} variant="outline">
            {statusLabels[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client || !client.name) return <span className="text-muted-foreground">Sin asignar</span>;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{client.name}</span>
            <span className="text-sm text-muted-foreground">{client.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "key_type",
      header: "Tipo de Licencia",
      cell: ({ row }) => row.original.key_type.name,
    },
    {
      accessorKey: "init_date",
      header: "Fecha Inicio",
      cell: ({ row }) => {
        const date = row.original.init_date;
        if (!date || date === "0001-01-01 00:00:00") return "-";
        const formatted = new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return formatted;
      },
    },
    {
      accessorKey: "due_date",
      header: "Fecha Vencimiento",
      cell: ({ row }) => {
        const date = row.original.due_date;
        if (!date || date === "0001-01-01 00:00:00") return "-";
        const formatted = new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return formatted;
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha Creación",
      cell: ({ row }) => {
        const date = row.original.created_at;
        if (!date) return "-";
        const formatted = new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return formatted;
      },
    },
  ];

  const keys = batch.keys || [];
  const paginatedKeys = keys.slice(offset, offset + limit);

  // Calcular el total de keys por estado
  const statusCounts = batch.key_status_counts || [];
  const totalKeys = statusCounts.reduce((sum, item) => sum + item.count, 0);

  const getStatusCount = (status: StatusEnum): number => {
    const statusCount = statusCounts.find((sc) => sc.state === status);
    return statusCount ? statusCount.count : 0;
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{batch.title}</h1>
          <p className="text-muted-foreground mt-1">Detalles y gestión del lote</p>
        </div>
      </div>

      {/* Información del Lote */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Cantidad Total</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batch.quantity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Descripción</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{batch.description || "Sin descripción"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Fecha Creación</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {new Date(batch.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {new Date(batch.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de las Licencias */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de las Licencias</CardTitle>
          <CardDescription>Distribución de licencias por estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Activas - Obtiene el valor de key_status_counts */}
            <Card className="border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {statusIcons.ACTIVE}
                      <span className="text-sm font-medium text-muted-foreground">Activas</span>
                    </div>
                    <span className="text-3xl font-bold">{getStatusCount("ACTIVE")}</span>
                  </div>
                  {totalKeys > 0 && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20" variant="outline">
                      {((getStatusCount("ACTIVE") / totalKeys) * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inactivas - Obtiene el valor de key_status_counts */}
            <Card className="border-gray-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {statusIcons.INACTIVE}
                      <span className="text-sm font-medium text-muted-foreground">Inactivas</span>
                    </div>
                    <span className="text-3xl font-bold">{getStatusCount("INACTIVE")}</span>
                  </div>
                  {totalKeys > 0 && (
                    <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20" variant="outline">
                      {((getStatusCount("INACTIVE") / totalKeys) * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aprobadas - Obtiene el valor de key_status_counts */}
            <Card className="border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {statusIcons.APPROVED}
                      <span className="text-sm font-medium text-muted-foreground">Aprobadas</span>
                    </div>
                    <span className="text-3xl font-bold">{getStatusCount("APPROVED")}</span>
                  </div>
                  {totalKeys > 0 && (
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20" variant="outline">
                      {((getStatusCount("APPROVED") / totalKeys) * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pendientes - Obtiene el valor de key_status_counts */}
            <Card className="border-yellow-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {statusIcons.PENDING}
                      <span className="text-sm font-medium text-muted-foreground">Pendientes</span>
                    </div>
                    <span className="text-3xl font-bold">{getStatusCount("PENDING")}</span>
                  </div>
                  {totalKeys > 0 && (
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20" variant="outline">
                      {((getStatusCount("PENDING") / totalKeys) * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expiradas - Obtiene el valor de key_status_counts */}
            <Card className="border-red-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {statusIcons.EXPIRED}
                      <span className="text-sm font-medium text-muted-foreground">Expiradas</span>
                    </div>
                    <span className="text-3xl font-bold">{getStatusCount("EXPIRED")}</span>
                  </div>
                  {totalKeys > 0 && (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20" variant="outline">
                      {((getStatusCount("EXPIRED") / totalKeys) * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Licencias */}
      <Card>
        <CardHeader>
          <CardTitle>Licencias del Lote</CardTitle>
          <CardDescription>Listado completo de las {keys.length} licencias asociadas a este lote</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={paginatedKeys}
            total={keys.length}
            offset={offset}
            limit={limit}
            onOffsetChange={setOffset}
            onLimitChange={setLimit}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
