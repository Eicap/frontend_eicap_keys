import { useEffect, useState } from "react";
import { useKeyStore } from "../../../store/useKeyStore";
import {
  Edit2,
  Trash2,
  Key,
  Calendar,
  Shield,
  Zap,
  Building2,
  GraduationCap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import SearchBar from "../../../components/shared/SearchBar";
import KeyModal from "./KeyModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function InactiveKeyList() {
  const { inactiveKeys, searchQuery, setSearchQuery, deleteKey, fetchInactiveKeys, isLoading, createBulkKeys } =
    useKeyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  // Filter keys based on search query
  const filteredKeys = inactiveKeys.filter((key) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      key.code.toLowerCase().includes(searchLower) ||
      key.key_type.name.toLowerCase().includes(searchLower) ||
      key.state.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKeys = filteredKeys.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch keys on component mount
  useEffect(() => {
    fetchInactiveKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (keyId: string) => {
    setEditingKey(keyId);
    setIsModalOpen(true);
  };

  const handleDelete = (keyId: string) => {
    setKeyToDelete(keyId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (keyToDelete) {
      try {
        await deleteKey(keyToDelete);
        await fetchInactiveKeys();
        toast.success("Key eliminada correctamente");
      } catch (error) {
        console.error("Error deleting key:", error);
        toast.error("Error al eliminar la key");
      } finally {
        setDeleteDialogOpen(false);
        setKeyToDelete(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
    fetchInactiveKeys();
  };

  const handleGenerateBulk = async () => {
    const quantity = parseInt(bulkQuantity);
    if (isNaN(quantity) || quantity < 1 || quantity > 100) {
      toast.error("Por favor ingresa una cantidad válida entre 1 y 100");
      return;
    }

    try {
      setIsGenerating(true);
      await createBulkKeys(quantity);
      setShowBulkDialog(false);
      setBulkQuantity("5");
      await fetchInactiveKeys();
      toast.success(`${quantity} keys generadas correctamente`);
    } catch (error) {
      console.error("Error generating bulk keys:", error);
      toast.error("Error al generar las keys. Intenta nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusConfig = (state: string) => {
    switch (state) {
      case "active":
        return {
          bg: "bg-green-500/10",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-500/30",
          icon: <Zap className="w-3 h-3" />,
          label: "Activo",
        };
      case "inactive":
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-700 dark:text-gray-400",
          border: "border-gray-500/30",
          icon: <Shield className="w-3 h-3" />,
          label: "Inactivo",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-700 dark:text-gray-400",
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
          text: "text-purple-700 dark:text-purple-400",
          border: "border-purple-500/30",
          icon: <Building2 className="w-3 h-3" />,
        };
      case "estudiantil":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-500/30",
          icon: <GraduationCap className="w-3 h-3" />,
        };
      default:
        return {
          bg: "bg-gray-500/10",
          text: "text-gray-700 dark:text-gray-400",
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
          <p className="text-muted-foreground">Cargando keys inactivas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Keys Inactivas</h1>
          <p className="text-muted-foreground">Keys disponibles para asignar o reutilizar</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500/10 border border-gray-500/30">
            <Shield className="w-5 h-5 text-gray-700 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-400 font-semibold">{filteredKeys.length} Keys Disponibles</span>
          </div>
          <button
            onClick={() => setShowBulkDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#254181] to-[#3d5fa3] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Generar Keys
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por código, tipo o estado..." />

      {/* Table Container - Responsive */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Código</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha Inicio</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha Expiración</th>
                  <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentKeys.map((key) => {
                  const statusConfig = getStatusConfig(key.state);
                  const keyTypeConfig = getKeyTypeConfig(key.key_type.name);

                  return (
                    <tr key={key.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      {/* Code */}
                      <td className="p-4 min-w-25">
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
                            onClick={() => handleEdit(key.id)}
                            className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-500 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
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
        <div className="md:hidden space-y-4 p-4 max-h-[calc(100vh-320px)] overflow-y-auto">
          {currentKeys.map((key) => {
            const statusConfig = getStatusConfig(key.state);
            const keyTypeConfig = getKeyTypeConfig(key.key_type.name);

            return (
              <div key={key.id} className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white shadow-md">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-card-foreground">{key.code}</p>
                      <p className="text-xs text-muted-foreground">Código</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(key.id)}
                      className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-500 hover:bg-red-500/20 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredKeys.length)} de {filteredKeys.length} keys
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-card border border-border text-card-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-[#254181] to-[#3d5fa3] text-white"
                            : "bg-card border border-border text-card-foreground hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-card border border-border text-card-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredKeys.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No hay keys inactivas</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Intenta con otro término de búsqueda"
              : "Todas las keys están actualmente en uso o no hay keys disponibles"}
          </p>
        </div>
      )}

      {/* Modal */}
      <KeyModal isOpen={isModalOpen} onClose={handleCloseModal} keyId={editingKey} />

      {/* Bulk Generation Dialog */}
      {showBulkDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Generar Keys</h2>
                  <p className="text-sm text-muted-foreground">Crear múltiples keys inactivas</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkDialog(false)}
                disabled={isGenerating}
                className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Cantidad de Keys</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(e.target.value)}
                  disabled={isGenerating}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#254181] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Ingresa la cantidad (1-100)"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Se generarán {bulkQuantity || "0"} keys inactivas disponibles para asignar
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Shield className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Las keys generadas estarán disponibles para ser asignadas a clientes
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
              <button
                onClick={() => setShowBulkDialog(false)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg border border-border text-card-foreground hover:bg-muted transition-all font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateBulk}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-[#254181] to-[#3d5fa3] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Generar Keys
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción eliminará permanentemente la key. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-card-foreground hover:bg-muted/80">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
