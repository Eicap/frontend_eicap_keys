import { useState } from 'react';
import { useClientStore } from '../../../store/useClientStore';
import { Plus, Edit2, Trash2, Mail, Phone, User } from 'lucide-react';
import SearchBar from '../../../components/shared/SearchBar';
import ActionButton from '../../../components/shared/ActionButton';
import ClientModal from './ClientModal';

export default function ClientList() {
  const { getFilteredClients, searchQuery, setSearchQuery, deleteClient } = useClientStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);

  const clients = getFilteredClients();

  const handleEdit = (clientId: string) => {
    setEditingClient(clientId);
    setIsModalOpen(true);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      deleteClient(clientId);
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
          <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-gray-400">Gestiona tus clientes de manera eficiente</p>
        </div>
        <ActionButton
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          label="Nuevo Cliente"
          variant="create"
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar por nombre, email o teléfono..."
      />

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => {
          return (
            <div
              key={client.id}
              className="
                group relative bg-[#1a1a1a] rounded-xl p-5
                border border-gray-800 hover:border-[#254181]
                transition-all duration-300
                hover:shadow-lg hover:shadow-[#254181]/20
              "
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Avatar and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {client.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client.id)}
                      className="p-2 rounded-lg bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 rounded-lg bg-gray-800 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <User className="w-4 h-4 text-[#254181]" />
                    </div>
                    <span className="font-semibold text-base text-white">{client.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-400 truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <Phone className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm text-gray-400">{client.telefono}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-500">
                    Creado: {new Date(client.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No se encontraron clientes</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? 'Intenta con otro término de búsqueda'
              : 'Comienza agregando tu primer cliente'}
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
      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        clientId={editingClient}
      />
    </div>
  );
}
