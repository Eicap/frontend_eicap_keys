import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useClientStore } from '../../../store/useClientStore';
import type { Client } from '../../../store/useClientStore';
import * as Dialog from '@radix-ui/react-dialog';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string | null;
}

interface ClientFormData {
  nombre: string;
  email: string;
  telefono: string;
}

export default function ClientModal({ isOpen, onClose, clientId }: ClientModalProps) {
  const { clients, addClient, updateClient } = useClientStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();

  const client = clientId ? clients.find((c) => c.id === clientId) : null;

  useEffect(() => {
    if (client) {
      reset({
        nombre: client.nombre,
        email: client.email,
        telefono: client.telefono,
      });
    } else {
      reset({
        nombre: '',
        email: '',
        telefono: '',
      });
    }
  }, [client, reset, isOpen]);

  const onSubmit = (data: ClientFormData) => {
    if (clientId) {
      updateClient(clientId, data);
    } else {
      addClient(data);
    }
    onClose();
    reset();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              {clientId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-accent">*</span>
              </label>
              <input
                {...register('nombre', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.nombre ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
                placeholder="Ej: Juan Pérez"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-accent">{errors.nombre.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.email ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
                placeholder="Ej: juan@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-accent">{errors.email.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span className="text-accent">*</span>
              </label>
              <input
                type="tel"
                {...register('telefono', {
                  required: 'El teléfono es requerido',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                    message: 'Teléfono inválido',
                  },
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.telefono ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
                placeholder="Ej: +1234567890"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-accent">{errors.telefono.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary/30 transition-all hover:scale-105"
              >
                {clientId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
