import { useEffect, useState } from "react";
import { useKeyStore } from "../../../store/useKeyStore";
import {
  Key,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
  GraduationCap,
  Users,
  Shield,
  Zap,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface KeyStats {
  total: number;
  active: number;
  inactive: number;
  expiringSoon: number;
  empresarial: number;
  estudiantil: number;
  byClient: { name: string; count: number }[];
  expiringKeys: Array<{
    code: string;
    client_name: string;
    due_date: string;
    days_left: number;
  }>;
}

export default function KeyReports() {
  const { keys, inactiveKeys, fetchKeys, fetchInactiveKeys, isLoading } = useKeyStore();
  const [stats, setStats] = useState<KeyStats>({
    total: 0,
    active: 0,
    inactive: 0,
    expiringSoon: 0,
    empresarial: 0,
    estudiantil: 0,
    byClient: [],
    expiringKeys: [],
  });

  useEffect(() => {
    fetchKeys();
    fetchInactiveKeys();
  }, [fetchKeys, fetchInactiveKeys]);

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, inactiveKeys]);

  const calculateStats = () => {
    const allKeys = [...keys, ...inactiveKeys];
    const active = keys.length;
    const inactive = inactiveKeys.length;

    // Keys por expirar (próximos 30 días)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringSoon = keys.filter((key) => {
      const dueDate = new Date(key.due_date);
      return dueDate >= today && dueDate <= thirtyDaysFromNow;
    }).length;

    // Keys por tipo
    const empresarial = allKeys.filter((k) => k.key_type.name === "empresarial").length;
    const estudiantil = allKeys.filter((k) => k.key_type.name === "estudiantil").length;

    // Keys por cliente (solo activas con cliente asignado)
    const clientMap = new Map<string, number>();
    keys.forEach((key) => {
      if (key.client_name) {
        clientMap.set(key.client_name, (clientMap.get(key.client_name) || 0) + 1);
      }
    });

    const byClient = Array.from(clientMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Keys próximas a expirar con detalles
    const expiringKeys = keys
      .filter((key) => {
        const dueDate = new Date(key.due_date);
        return dueDate >= today && dueDate <= thirtyDaysFromNow;
      })
      .map((key) => {
        const dueDate = new Date(key.due_date);
        const days_left = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          code: key.code,
          client_name: key.client_name || "Sin asignar",
          due_date: key.due_date,
          days_left,
        };
      })
      .sort((a, b) => a.days_left - b.days_left)
      .slice(0, 10);

    setStats({
      total: allKeys.length,
      active,
      inactive,
      expiringSoon,
      empresarial,
      estudiantil,
      byClient,
      expiringKeys,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <BarChart3 className="w-12 h-12 text-primary" />
          </div>
          <p className="text-muted-foreground mt-4">Generando reportes...</p>
        </div>
      </div>
    );
  }

  const activePercentage = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : "0";
  const empresarialPercentage = stats.total > 0 ? ((stats.empresarial / stats.total) * 100).toFixed(1) : "0";

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reportes de Keys</h1>
        <p className="text-muted-foreground">Análisis detallado del estado de las licencias</p>
      </div>

      {/* Scrollable Content - Landing style */}
      <div
        className="flex-1 overflow-y-auto space-y-6 animate-fade-in scrollbar-hide"
        style={{
          maxHeight: "calc(100vh - 180px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Keys */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Total de Keys</p>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-white/70 mt-2">Todas las licencias</p>
            </div>
          </div>

          {/* Active Keys */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Keys Activas</p>
              <p className="text-3xl font-bold">{stats.active}</p>
              <p className="text-xs text-white/70 mt-2">{activePercentage}% del total</p>
            </div>
          </div>

          {/* Inactive Keys */}
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <TrendingDown className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Keys Inactivas</p>
              <p className="text-3xl font-bold">{stats.inactive}</p>
              <p className="text-xs text-white/70 mt-2">Disponibles para asignar</p>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <Calendar className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Por Expirar</p>
              <p className="text-3xl font-bold">{stats.expiringSoon}</p>
              <p className="text-xs text-white/70 mt-2">Próximos 30 días</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Types Distribution */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Distribución por Tipo</h2>
                <p className="text-sm text-muted-foreground mt-1">Empresarial vs Estudiantil</p>
              </div>
              <PieChart className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {/* Empresarial */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">Empresarial</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {stats.empresarial} ({empresarialPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${empresarialPercentage}%` }}
                  />
                </div>
              </div>

              {/* Estudiantil */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-foreground">Estudiantil</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {stats.estudiantil} ({(100 - parseFloat(empresarialPercentage)).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${100 - parseFloat(empresarialPercentage)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span>
                  Total analizado: <span className="font-semibold text-foreground">{stats.total}</span> keys
                </span>
              </div>
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Top Clientes</h2>
                <p className="text-sm text-muted-foreground mt-1">Keys activas por cliente</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>

            {stats.byClient.length > 0 ? (
              <div className="space-y-3">
                {stats.byClient.map((client, index) => (
                  <div key={client.name} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#254181] to-[#3d5fa3] h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(client.count / Math.max(...stats.byClient.map((c) => c.count))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{client.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No hay datos de clientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Expiring Keys Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-orange-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Keys Próximas a Expirar</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Requieren atención en los próximos 30 días</p>
              </div>
            </div>
          </div>

          {stats.expiringKeys.length > 0 ? (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 sticky top-0 z-10">
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 text-sm font-bold text-slate-700 dark:text-slate-200">Código</th>
                    <th className="text-left p-4 text-sm font-bold text-slate-700 dark:text-slate-200">Cliente</th>
                    <th className="text-left p-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                      Fecha Expiración
                    </th>
                    <th className="text-left p-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                      Días Restantes
                    </th>
                    <th className="text-left p-4 text-sm font-bold text-slate-700 dark:text-slate-200">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.expiringKeys.map((key, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold text-foreground">{key.code}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-foreground">{key.client_name}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-foreground">{formatDate(key.due_date)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          {key.days_left} días
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            key.days_left <= 7
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : key.days_left <= 15
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {key.days_left <= 7 ? (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              Urgente
                            </>
                          ) : key.days_left <= 15 ? (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              Pronto
                            </>
                          ) : (
                            <>
                              <Calendar className="w-3 h-3" />
                              Próximo
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <Zap className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">¡Todo en orden!</h3>
              <p className="text-sm text-muted-foreground">No hay keys próximas a expirar en los próximos 30 días</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
