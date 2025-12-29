import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetKeyLoginsByKeyId } from "@/hooks/key_login.tsx/key_login";
import { useGetKey, useGetKeyHistory } from "@/hooks/keys/useQuery.key";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Building2, Calendar, Clock, History, Key, LogIn } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_protected/keys/$keys")({
  component: RouteComponent,
});

function RouteComponent() {
  const { keys: keyId } = Route.useParams();
  const [historyPage, setHistoryPage] = useState({ offset: 0, limit: 10 });

  const { data: key, isLoading: isLoadingKey } = useGetKey(keyId);
  const { data: historyData, isLoading: isLoadingHistory } = useGetKeyHistory(keyId, historyPage);
  const { data: logins, isLoading: isLoadingLogins } = useGetKeyLoginsByKeyId(keyId);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPROVED: "bg-green-500",
      PENDING: "bg-yellow-500",
      REJECTED: "bg-red-500",
      EXPIRED: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const formatDate = (date: string | null | undefined, formatStr: string): string => {
    if (!date) return "-";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "-";
      return format(parsedDate, formatStr, { locale: es });
    } catch {
      return "-";
    }
  };

  if (isLoadingKey) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!key) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Key no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/keys">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Detalles de la Key</h1>
            <p className="text-muted-foreground">{key.code}</p>
          </div>
        </div>
        <Badge className={getStatusColor(key.state)}>{key.state}</Badge>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Código</p>
              <p className="text-lg font-mono">{key.code}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Key</p>
              <p className="text-lg">{key.key_type.name}</p>
              {key.key_type.description && <p className="text-sm text-muted-foreground">{key.key_type.description}</p>}
            </div>

            {key.client && (
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Cliente
                </p>
                <p className="text-lg">{key.client.name}</p>
                <p className="text-sm text-muted-foreground">{key.client.email}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Inicio
              </p>
              <p className="text-lg">{formatDate(key.init_date, "dd 'de' MMMM, yyyy")}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Vencimiento
              </p>
              <p className="text-lg">{formatDate(key.due_date, "dd 'de' MMMM, yyyy")}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Última Actualización
              </p>
              <p className="text-lg">{formatDate(key.updated_at, "dd/MM/yyyy HH:mm")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="logins" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Logins
          </TabsTrigger>
        </TabsList>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
              <CardDescription>Registro de todas las modificaciones realizadas a esta key</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : historyData && historyData.data.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Fecha Inicio</TableHead>
                        <TableHead>Fecha Vencimiento</TableHead>
                        <TableHead>Modificado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.data.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono">{record.code}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.state)}>{record.state}</Badge>
                          </TableCell>
                          <TableCell>{record.client?.name || "Sin cliente"}</TableCell>
                          <TableCell>{formatDate(record.init_date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{formatDate(record.due_date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{formatDate(record.updated_at, "dd/MM/yyyy HH:mm")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {historyData.data.length} de {historyData.total} registros
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={historyPage.offset === 0}
                        onClick={() =>
                          setHistoryPage((prev) => ({
                            ...prev,
                            offset: Math.max(0, prev.offset - prev.limit),
                          }))
                        }
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={historyPage.offset + historyPage.limit >= historyData.total}
                        onClick={() =>
                          setHistoryPage((prev) => ({
                            ...prev,
                            offset: prev.offset + prev.limit,
                          }))
                        }
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay historial disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logins Tab */}
        <TabsContent value="logins">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Logins</CardTitle>
              <CardDescription>Registro de todos los inicios de sesión con esta key</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLogins ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : logins && logins.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Computadora</TableHead>
                      <TableHead>Sistema Operativo</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logins.map((login) => (
                      <TableRow key={login.id}>
                        <TableCell>{formatDate(login.date, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                        <TableCell className="font-mono">{login.ip || "-"}</TableCell>
                        <TableCell>{login.computer_info?.computer_name || "-"}</TableCell>
                        <TableCell>{login.computer_info?.os || "-"}</TableCell>
                        <TableCell>
                          {login.computer_info?.state && <Badge variant="outline">{login.computer_info.state}</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <LogIn className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay logins registrados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
