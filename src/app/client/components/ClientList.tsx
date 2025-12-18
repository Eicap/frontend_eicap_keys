import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "../../../store/useClientStore";
import { Plus, Edit2, Trash2, Mail, Phone, User, Eye } from "lucide-react";
import SearchBar from "../../../components/shared/SearchBar";
import ActionButton from "../../../components/shared/ActionButton";
import ClientModal from "./ClientModal";
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

export default function ClientList() {
  const { getFilteredClients, searchQuery, setSearchQuery, deleteClient, fetchClients, isLoading } = useClientStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const clients = getFilteredClients();

  const handleEdit = (clientId: string) => {
    setEditingClient(clientId);
    setIsModalOpen(true);
  };

  const handleDelete = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await deleteClient(clientToDelete);
        toast.success("Cliente eliminado correctamente");
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Error al eliminar el cliente");
      } finally {
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tus clientes de manera eficiente</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          {/* Total de Clientes */}
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Total de clientes</p>
            <p className="text-4xl font-bold text-foreground">{clients.length}</p>
          </div>
          <ActionButton onClick={() => setIsModalOpen(true)} icon={Plus} label="Nuevo Cliente" variant="create" />
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por nombre, email o teléfono..." />

      {/* Clients Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-[#254181] rounded-full"></div>
          </div>
          <p className="text-muted-foreground mt-4">Cargando clientes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {clients.map((client) => {
            return (
              <div
                key={client.id}
                className="
                  group relative bg-card rounded-xl p-5
                  border border-border hover:border-[#254181]
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-[#254181]/20
                "
              >
                {/* Content */}
                <div className="relative z-10">
                  {/* Avatar and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/client/${client.id}/keys`)}
                        className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all"
                        title="Ver Keys"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(client.id)}
                        className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <User className="w-4 h-4 text-[#254181]" />
                      </div>
                      <span className="font-semibold text-base text-card-foreground">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm text-muted-foreground truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <Phone className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">{client.phone}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Creado: {client.created_at ? new Date(client.created_at).toLocaleDateString("es-ES") : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && clients.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron clientes</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Intenta con otro término de búsqueda" : "Comienza agregando tu primer cliente"}
          </p>
          {!searchQuery && (
            <ActionButton
              onClick={() => setIsModalOpen(true)}
              icon={Plus}
              label="Crear Primer Cliente"
              variant="create"
            />
          )}
        </div>
      )}

      {/* Modal */}
      <ClientModal isOpen={isModalOpen} onClose={handleCloseModal} clientId={editingClient} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción eliminará permanentemente el cliente y todos sus datos asociados. Esta acción no se puede
              deshacer.
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
