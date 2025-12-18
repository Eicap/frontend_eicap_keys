import { useEffect, useState } from "react";
import { useKeyStore } from "../../../store/useKeyStore";
import { Plus, Edit2, Trash2, Key, Calendar, Shield, Zap, Building2, GraduationCap, Loader2 } from "lucide-react";
import SearchBar from "../../../components/shared/SearchBar";
import ActionButton from "../../../components/shared/ActionButton";
import KeyModal from "./KeyModal";

export default function KeyList() {
  const { getFilteredKeys, searchQuery, setSearchQuery, deleteKey, fetchKeys, isLoading } = useKeyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const keys = getFilteredKeys();

  // Fetch keys on component mount
  useEffect(() => {
    fetchKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (keyId: string) => {
    setEditingKey(keyId);
    setIsModalOpen(true);
  };

  const handleDelete = async (keyId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta key?")) {
      await deleteKey(keyId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
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
          icon: <Key className="w-3 h-3" />,
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
          <p className="text-gray-400">Cargando keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Keys</h1>
          <p className="text-gray-400">Administra las licencias y claves de acceso</p>
        </div>
        <ActionButton onClick={() => setIsModalOpen(true)} icon={Plus} label="Nueva Key" variant="create" />
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar por código, tipo, estado, cliente o permisos..."
      />

      {/* Keys Grid - Scrollable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {keys.map((key) => {
          const statusConfig = getStatusConfig(key.state);
          const keyTypeConfig = getKeyTypeConfig(key.key_type.name);
          const isEmpresarial = key.key_type.name.toLowerCase() === "empresarial";

          return (
            <div
              key={key.id}
              className="
                group relative bg-[#1a1a1a] rounded-xl p-6
                border border-gray-800 hover:border-[#254181]
                transition-all duration-300
                hover:shadow-lg hover:shadow-[#254181]/20
              "
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-linear-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white shadow-lg">
                    <Key className="w-7 h-7" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(key.id)}
                      className="p-2 rounded-lg bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="p-2 rounded-lg bg-gray-800 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code */}
                <div className="mb-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Código</p>
                  <p className="font-mono text-sm font-bold text-white break-all">{key.code}</p>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex items-center gap-1.5`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label.toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${keyTypeConfig.bg} ${keyTypeConfig.text} ${keyTypeConfig.border} flex items-center gap-1.5`}
                  >
                    {keyTypeConfig.icon}
                    {key.key_type.name.toUpperCase()}
                  </span>
                </div>

                {/* Client - Only for empresarial */}
                {isEmpresarial && key.client_name && (
                  <div className="mb-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <p className="text-xs text-purple-400 mb-1 font-medium flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Cliente
                    </p>
                    <p className="text-sm font-semibold text-purple-300">{key.client_name}</p>
                  </div>
                )}

                {/* Permissions */}
                {key.permissions && key.permissions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Permisos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {key.permissions.map((permission) => (
                        <span
                          key={permission.id}
                          className="px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        >
                          {permission.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-gray-400">Inicio:</span>
                    <span className="text-xs font-semibold text-blue-400">{formatDate(key.init_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-gray-400">Expira:</span>
                    <span className="text-xs font-semibold text-red-400">{formatDate(key.due_date)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Creado: {formatDate(key.created_at)}</span>
                  {key.user_name && <span className="text-xs text-gray-500">Por: {key.user_name}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {keys.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-xl">
            <Key className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No se encontraron keys</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? "Intenta con otro término de búsqueda" : "Comienza agregando tu primera key"}
          </p>
          {!searchQuery && (
            <ActionButton onClick={() => setIsModalOpen(true)} icon={Plus} label="Crear Primera Key" variant="create" />
          )}
        </div>
      )}

      {/* Modal */}
      <KeyModal isOpen={isModalOpen} onClose={handleCloseModal} keyId={editingKey} />
    </div>
  );
}
