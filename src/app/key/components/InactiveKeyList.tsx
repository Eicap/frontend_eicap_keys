import { useEffect, useState } from "react";
import { useKeyStore } from "../../../store/useKeyStore";
import {
  Edit2,
  Trash2,
  Key,
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
  const {
    inactiveKeys,
    searchQuery,
    setSearchQuery,
    deleteKey,
    fetchInactiveKeys,
    isLoading,
    createBulkKeys,
    totalInactiveKeys,
    // currentInactivePage,
    itemsPerPage,
    totalInactivePages,
  } = useKeyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  // Use filtered keys for display (client-side search)
  const displayKeys = searchQuery
    ? inactiveKeys.filter((key) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          key.code.toLowerCase().includes(searchLower) ||
          key.key_type.name.toLowerCase().includes(searchLower) ||
          key.state.toLowerCase().includes(searchLower)
        );
      })
    : inactiveKeys;

  // Calculate pagination info
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Fetch keys on component mount and when page changes
  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    fetchInactiveKeys(itemsPerPage, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

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
        // Recargar la página actual con refresh forzado
        const offset = (currentPage - 1) * itemsPerPage;
        await fetchInactiveKeys(itemsPerPage, offset, true);
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
    // Recargar la página actual con refresh forzado
    const offset = (currentPage - 1) * itemsPerPage;
    fetchInactiveKeys(itemsPerPage, offset, true);
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
      // El createBulkKeys ya recarga automáticamente
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
            <span className="text-gray-700 dark:text-gray-400 font-semibold">
              {searchQuery ? displayKeys.length : totalInactiveKeys} Keys Disponibles
            </span>
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
      {displayKeys.length > 0 || isLoading ? (
        <div className="space-y-4">
          <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm max-h-[calc(100vh-320px)] relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Cargando keys inactivas...</p>
                </div>
              </div>
            )}
            <table className="w-full min-w-[800px]">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-300 dark:border-slate-600 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Fecha Expiración
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border">
                {displayKeys.map((key, index) => {
                  const statusConfig = getStatusConfig(key.state);
                  const keyTypeConfig = getKeyTypeConfig(key.key_type.name);

                  return (
                    <tr
                      key={key.id}
                      className={`
                        transition-colors hover:bg-muted/30
                        ${index % 2 === 0 ? "bg-card" : "bg-muted/10"}
                      `}
                    >
                      {/* Code */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-card-foreground">{key.code}</span>
                      </td>

                      {/* Key Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${keyTypeConfig.bg} ${keyTypeConfig.text} ${keyTypeConfig.border}`}
                        >
                          {keyTypeConfig.icon}
                          {key.key_type.name.charAt(0).toUpperCase() + key.key_type.name.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Init Date */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-card-foreground">{formatDate(key.init_date)}</span>
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-card-foreground">{formatDate(key.due_date)}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
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

          {/* Pagination Controls */}
          {!searchQuery && totalInactivePages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-card border-t border-border">
              {/* Results info */}
              <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{startIndex + 1}</span> a{" "}
                <span className="font-semibold text-foreground">{Math.min(endIndex, totalInactiveKeys)}</span> de{" "}
                <span className="font-semibold text-foreground">{totalInactiveKeys}</span> resultados
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalInactivePages) }, (_, i) => {
                    let pageNum;
                    if (totalInactivePages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalInactivePages - 2) {
                      pageNum = totalInactivePages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`
                          min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-[#254181] to-[#3d5fa3] text-white shadow-lg"
                              : "border border-border bg-card hover:bg-muted text-foreground"
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalInactivePages, prev + 1))}
                  disabled={currentPage === totalInactivePages}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Página siguiente"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
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
