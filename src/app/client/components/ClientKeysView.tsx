import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { keyService } from "../../../services/key.service";
import type { Key } from "../../../services/types/responses";
import {
  ArrowLeft,
  Key as KeyIcon,
  Calendar,
  Shield,
  Zap,
  Building2,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  User,
  Clock,
} from "lucide-react";
import KeyDetailsModal from "../../key/components/KeyDetailsModal";

export default function ClientKeysView() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (clientId) {
      fetchClientKeys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const fetchClientKeys = async () => {
    try {
      setIsLoading(true);
      const response = await keyService.getKeysByClient(clientId!);
      setKeys(response.data);
    } catch (error) {
      console.error("Error fetching client keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (key: Key) => {
    setSelectedKey(key);
    setShowDetailsModal(true);
  };

  const getStatusConfig = (state: string) => {
    switch (state) {
      case "active":
        return {
          bg: "bg-green-500/10",
          text: "text-green-400",
          border: "border-green-500/30",
          icon: <Zap className="w-3 h-3" />,
          label: "Activo",
        };
      case "inactive":
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          icon: <Shield className="w-3 h-3" />,
          label: "Inactivo",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          icon: <Shield className="w-3 h-3" />,
          label: state,
        };
    }
  };

  const getKeyTypeConfig = (keyTypeName: string) => {
    switch (keyTypeName.toLowerCase()) {
      case "empresarial":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-400",
          border: "border-purple-500/30",
          icon: <Building2 className="w-3 h-3" />,
        };
      case "estudiantil":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/30",
          icon: <GraduationCap className="w-3 h-3" />,
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          icon: <KeyIcon className="w-3 h-3" />,
        };
    }
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
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  const client = keys[0]?.client;

  if (!client) {
    return (
      <div className="space-y-4 animate-fade-in">
        <button
          onClick={() => navigate("/client/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-card-foreground hover:bg-muted/80 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Clientes
        </button>
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Cliente no encontrado</h3>
          <p className="text-muted-foreground">No se pudo cargar la información del cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/client/dashboard")}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-card-foreground hover:bg-muted/80 transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Clientes
      </button>

      {/* Client Info Card - Compacto */}
      <div className="bg-gradient-to-br from-[#254181] to-[#3d5fa3] rounded-xl p-4 text-white shadow-lg border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{client.name}</h1>
              <p className="text-white/70 text-xs">Información del Cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
            <KeyIcon className="w-4 h-4" />
            <span className="font-semibold text-sm">{keys.length} Keys</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Mail className="w-4 h-4 text-white/80" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/70">Email</p>
              <p className="text-sm font-medium truncate">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Phone className="w-4 h-4 text-white/80" />
            <div>
              <p className="text-xs text-white/70">Teléfono</p>
              <p className="text-sm font-medium">{client.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Clock className="w-4 h-4 text-white/80" />
            <div>
              <p className="text-xs text-white/70">Cliente desde</p>
              <p className="text-sm font-medium">{formatDate(client.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Keys Section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-bold text-foreground">Keys Asignadas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Todas las licencias activas e inactivas del cliente</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Código</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Permisos</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha Inicio</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha Expiración</th>
                  <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => {
                  const statusConfig = getStatusConfig(key.state);
                  const keyTypeConfig = getKeyTypeConfig(key.key_type.name);

                  return (
                    <tr key={key.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      {/* Code */}
                      <td className="p-4 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-card-foreground break-all">
                            {key.code}
                          </span>
                        </div>
                      </td>

                      {/* Key Type */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${keyTypeConfig.bg} ${keyTypeConfig.text} ${keyTypeConfig.border}`}
                        >
                          {keyTypeConfig.icon}
                          {key.key_type.name.charAt(0).toUpperCase() + key.key_type.name.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Permissions */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.slice(0, 2).map((permission) => (
                            <span
                              key={permission.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20"
                            >
                              {permission.name}
                            </span>
                          ))}
                          {key.permissions.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">
                              +{key.permissions.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Init Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-card-foreground">{formatDate(key.init_date)}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Shield className="w-4 h-4 text-red-500" />
                          <span className="text-card-foreground">{formatDate(key.due_date)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(key)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all text-xs font-medium"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4 max-h-[calc(100vh-350px)] overflow-y-auto">
          {keys.map((key) => {
            const statusConfig = getStatusConfig(key.state);
            const keyTypeConfig = getKeyTypeConfig(key.key_type.name);

            return (
              <div key={key.id} className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white shadow-md">
                      <KeyIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-card-foreground">{key.code}</p>
                      <p className="text-xs text-muted-foreground">Código</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${keyTypeConfig.bg} ${keyTypeConfig.text} ${keyTypeConfig.border}`}
                  >
                    {keyTypeConfig.icon}
                    {key.key_type.name.charAt(0).toUpperCase() + key.key_type.name.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>

                {/* Permissions */}
                {key.permissions.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Permisos:</p>
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.map((permission) => (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20"
                        >
                          {permission.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <div>
                      <p className="text-muted-foreground">Inicio</p>
                      <p className="font-medium text-card-foreground">{formatDate(key.init_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Shield className="w-3 h-3 text-red-500" />
                    <div>
                      <p className="text-muted-foreground">Expira</p>
                      <p className="font-medium text-card-foreground">{formatDate(key.due_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleViewDetails(key)}
                  className="w-full px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all text-sm font-medium"
                >
                  Ver Detalles
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {keys.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-xl">
              <KeyIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Sin keys asignadas</h3>
            <p className="text-muted-foreground">Este cliente no tiene licencias asignadas todavía</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedKey && (
        <KeyDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedKey(null);
          }}
          keyData={selectedKey}
        />
      )}
    </div>
  );
}
