import { X, Key, Calendar, Shield, Building2, User, Clock } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface KeyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyData: {
    id: string;
    code: string;
    init_date: string;
    due_date: string;
    state: string;
    key_type: {
      id: string;
      name: string;
    };
    client_name?: string;
    client_id?: string;
    permissions: Array<{
      id: string;
      name: string;
    }>;
    created_at: string;
    updated_at?: string;
    user_name?: string;
  };
}

export default function KeyDetailsModal({ isOpen, onClose, keyData }: KeyDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (state: string) => {
    switch (state) {
      case "active":
        return {
          bg: "bg-green-500/10",
          text: "text-green-400",
          border: "border-green-500/30",
          label: "Activo",
        };
      case "inactive":
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          label: "Inactivo",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          border: "border-gray-500/30",
          label: state,
        };
    }
  };

  const statusConfig = getStatusConfig(keyData.state);
  const isEmpresarial = keyData.key_type.name.toLowerCase() === "empresarial";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl animate-scale-in z-50 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white shadow-lg">
                <Key className="w-7 h-7" />
              </div>
              <div>
                <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalles de la Key
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Información completa de la licencia
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-6 py-6">
            <div className="space-y-6">
              {/* Code Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wide">
                    Código de Licencia
                  </h3>
                </div>
                <p className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-400 break-all">
                  {keyData.code}
                </p>
              </div>

              {/* Status & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 dark:bg-gray-800/50 rounded-xl p-5 border border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Estado
                  </h3>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                  >
                    <Shield className="w-4 h-4" />
                    {statusConfig.label.toUpperCase()}
                  </span>
                </div>

                <div className="bg-muted/50 dark:bg-gray-800/50 rounded-xl p-5 border border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Tipo de Key
                  </h3>
                  <div className="flex items-center gap-2 text-lg font-semibold text-card-foreground dark:text-white">
                    {isEmpresarial ? (
                      <Building2 className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Key className="w-5 h-5 text-blue-500" />
                    )}
                    <span className={isEmpresarial ? "text-purple-400" : "text-blue-400"}>
                      {keyData.key_type.name.charAt(0).toUpperCase() + keyData.key_type.name.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client - Only for empresarial */}
              {isEmpresarial && keyData.client_name && (
                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wide">
                      Cliente Empresarial
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-400">{keyData.client_name}</p>
                </div>
              )}

              {/* Permissions */}
              {keyData.permissions && keyData.permissions.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-800">
                  <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Permisos Asignados ({keyData.permissions.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keyData.permissions.map((permission) => (
                      <span
                        key={permission.id}
                        className="px-3 py-2 rounded-lg text-sm font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wide">
                      Fecha de Inicio
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{formatDate(keyData.init_date)}</p>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 uppercase tracking-wide">
                      Fecha de Expiración
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatDate(keyData.due_date)}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-muted/30 dark:bg-gray-800/30 rounded-xl p-5 border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Información del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-gray-500 mb-1">Creado</p>
                    <p className="text-sm font-medium text-card-foreground dark:text-gray-300">
                      {formatDateTime(keyData.created_at)}
                    </p>
                  </div>
                  {keyData.updated_at && (
                    <div>
                      <p className="text-xs text-muted-foreground dark:text-gray-500 mb-1">Última actualización</p>
                      <p className="text-sm font-medium text-card-foreground dark:text-gray-300">
                        {formatDateTime(keyData.updated_at)}
                      </p>
                    </div>
                  )}
                  {keyData.user_name && (
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-gray-500">Creado por</p>
                          <p className="text-sm font-medium text-card-foreground dark:text-gray-300">
                            {keyData.user_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#254181] to-[#3d5fa3] text-white font-semibold hover:from-[#1e3469] hover:to-[#2d4a85] transition-all shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
