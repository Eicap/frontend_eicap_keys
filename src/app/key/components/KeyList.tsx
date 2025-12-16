import { useState } from 'react';
import { useKeyStore } from '../../../store/useKeyStore';
import { Plus, Edit2, Trash2, Key, Calendar, Shield, Zap, Crown, Rocket } from 'lucide-react';
import SearchBar from '../../../components/shared/SearchBar';
import ActionButton from '../../../components/shared/ActionButton';
import KeyModal from './KeyModal';

export default function KeyList() {
  const { getFilteredKeys, searchQuery, setSearchQuery, deleteKey } = useKeyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const keys = getFilteredKeys();

  const handleEdit = (keyId: string) => {
    setEditingKey(keyId);
    setIsModalOpen(true);
  };

  const handleDelete = (keyId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta key?')) {
      deleteKey(keyId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
  };

  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'activo':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: <Zap className="w-3 h-3" />,
        };
      case 'inactivo':
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: <Shield className="w-3 h-3" />,
        };
      case 'expirado':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: <Calendar className="w-3 h-3" />,
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: <Shield className="w-3 h-3" />,
        };
    }
  };

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case 'trial':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          icon: <Zap className="w-3 h-3" />,
        };
      case 'premium':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-500/30',
          icon: <Crown className="w-3 h-3" />,
        };
      case 'enterprise':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          icon: <Rocket className="w-3 h-3" />,
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: <Key className="w-3 h-3" />,
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Keys</h1>
          <p className="text-gray-400">Administra las licencias y claves de acceso</p>
        </div>
        <ActionButton
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          label="Nueva Key"
          variant="create"
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar por código, tipo o estado..."
      />

      {/* Keys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keys.map((key) => {
          const statusConfig = getStatusConfig(key.estado);
          const tipoConfig = getTipoConfig(key.tipo);
          
          return (
            <div
              key={key.id}
              className="
                group relative bg-[#1a1a1a] rounded-xl p-5
                border border-gray-800 hover:border-[#254181]
                transition-all duration-300
                hover:shadow-lg hover:shadow-[#254181]/20
              "
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center text-white shadow-lg">
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
                  <p className="font-mono text-xs font-bold text-white break-all">
                    {key.code}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex items-center gap-1.5`}>
                    {statusConfig.icon}
                    {key.estado.toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${tipoConfig.bg} ${tipoConfig.text} ${tipoConfig.border} flex items-center gap-1.5`}>
                    {tipoConfig.icon}
                    {key.tipo.toUpperCase()}
                  </span>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-gray-400">Inicio:</span>
                    <span className="text-xs font-semibold text-blue-400">
                      {new Date(key.fechaInicio).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-gray-400">Expira:</span>
                    <span className="text-xs font-semibold text-red-400">
                      {new Date(key.fechaExpiracion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-500">
                    Creado: {new Date(key.createdAt).toLocaleDateString('es-ES')}
                  </span>
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
            {searchQuery
              ? 'Intenta con otro término de búsqueda'
              : 'Comienza agregando tu primera key'}
          </p>
          {!searchQuery && (
            <ActionButton
              onClick={() => setIsModalOpen(true)}
              icon={Plus}
              label="Crear Primera Key"
              variant="create"
            />
          )}
        </div>
      )}

      {/* Modal */}
      <KeyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        keyId={editingKey}
      />
    </div>
  );
}
