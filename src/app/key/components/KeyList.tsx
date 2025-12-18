import { useEffect, useState } from "react";
import { useKeyStore } from "../../../store/useKeyStore";
import { Plus, Edit2, Trash2, Key, Eye, ChevronLeft, ChevronRight, Loader2, Building2, GraduationCap, Zap, Shield } from "lucide-react";
import SearchBar from "../../../components/shared/SearchBar";
import ActionButton from "../../../components/shared/ActionButton";
import KeyModal from "./KeyModal";

export default function KeyList() {
  const { 
    keys,
    getFilteredKeys, 
    searchQuery, 
    setSearchQuery, 
    deleteKey, 
    fetchKeys, 
    isLoading,
    totalKeys,
    currentPage: storePage,
    itemsPerPage,
    totalPages
  } = useKeyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [viewingKey, setViewingKey] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentPage, setCurrentPage] = useState(1);

  // Use filtered keys for display (client-side search)
  const displayKeys = searchQuery ? getFilteredKeys() : keys;
  
  // Calculate pagination info
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Fetch keys on component mount and when page changes
  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    fetchKeys(itemsPerPage, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const handleView = (keyId: string) => {
    setViewingKey(keyId);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (keyId: string) => {
    setEditingKey(keyId);
    setModalMode('edit');
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
    setViewingKey(null);
    setModalMode('create');
  };

  const handleCreateNew = () => {
    setEditingKey(null);
    setViewingKey(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30">
            <Zap className="w-3 h-3" />
            Activo
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/30">
            <Shield className="w-3 h-3" />
            Inactivo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/30">
            <Shield className="w-3 h-3" />
            {state}
          </span>
        );
    }
  };

  const getKeyTypeBadge = (keyTypeName: string) => {
    switch (keyTypeName.toLowerCase()) {
      case "empresarial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/30">
            <Building2 className="w-3 h-3" />
            Empresarial
          </span>
        );
      case "estudiantil":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <GraduationCap className="w-3 h-3" />
            Estudiantil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/30">
            <Key className="w-3 h-3" />
            {keyTypeName}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Keys</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Administra las licencias y claves de acceso</p>
        </div>
        <ActionButton onClick={handleCreateNew} icon={Plus} label="Nueva Key" variant="create" />
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar por código, tipo, estado, cliente..."
      />

      {/* Table Container - Responsive with horizontal scroll on mobile */}
      {displayKeys.length > 0 || isLoading ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[800px]">
              {/* Table Header */}
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fecha Expiración
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border">
                {displayKeys.map((key, index) => {
                  const isEmpresarial = key.key_type.name.toLowerCase() === "empresarial";
                  
                  return (
                    <tr
                      key={key.id}
                      className={`
                        transition-colors hover:bg-muted/30
                        ${index % 2 === 0 ? 'bg-card' : 'bg-muted/10'}
                      `}
                    >
                      {/* Código */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-card-foreground">
                          {key.code}
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3">
                        {getKeyTypeBadge(key.key_type.name)}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        {getStatusBadge(key.state)}
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3">
                        {isEmpresarial && key.client_name ? (
                          <span className="text-sm text-card-foreground">{key.client_name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Fecha Inicio */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-card-foreground">{formatDate(key.init_date)}</span>
                      </td>

                      {/* Fecha Expiración */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-card-foreground">{formatDate(key.due_date)}</span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(key.id)}
                            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
          {!searchQuery && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-card border border-border rounded-xl">
              {/* Results info */}
              <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{startIndex + 1}</span> a{" "}
                <span className="font-semibold text-foreground">{Math.min(endIndex, totalKeys)}</span> de{" "}
                <span className="font-semibold text-foreground">{totalKeys}</span> resultados
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
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
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-xl">
            <Key className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron keys</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Intenta con otro término de búsqueda" : "Comienza agregando tu primera key"}
          </p>
          {!searchQuery && (
            <ActionButton onClick={handleCreateNew} icon={Plus} label="Crear Primera Key" variant="create" />
          )}
        </div>
      )}

      {/* Modal */}
      <KeyModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        keyId={editingKey || viewingKey} 
        mode={modalMode}
      />
    </div>
  );
}
