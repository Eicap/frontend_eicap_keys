import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useKeyStore } from '../../../store/useKeyStore';
import * as Dialog from '@radix-ui/react-dialog';

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyId?: string | null;
}

interface KeyFormData {
  code: string;
  fechaInicio: string;
  fechaExpiracion: string;
  estado: 'activo' | 'inactivo' | 'expirado';
  tipo: 'trial' | 'premium' | 'enterprise';
}

export default function KeyModal({ isOpen, onClose, keyId }: KeyModalProps) {
  const { keys, addKey, updateKey } = useKeyStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KeyFormData>();

  const key = keyId ? keys.find((k) => k.id === keyId) : null;

  useEffect(() => {
    if (key) {
      reset({
        code: key.code,
        fechaInicio: new Date(key.fechaInicio).toISOString().split('T')[0],
        fechaExpiracion: new Date(key.fechaExpiracion).toISOString().split('T')[0],
        estado: key.estado,
        tipo: key.tipo,
      });
    } else {
      reset({
        code: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaExpiracion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'activo',
        tipo: 'trial',
      });
    }
  }, [key, reset, isOpen]);

  const onSubmit = (data: KeyFormData) => {
    const keyData = {
      ...data,
      fechaInicio: new Date(data.fechaInicio),
      fechaExpiracion: new Date(data.fechaExpiracion),
    };

    if (keyId) {
      updateKey(keyId, keyData);
    } else {
      addKey(keyData);
    }
    onClose();
    reset();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              {keyId ? 'Editar Key' : 'Nueva Key'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código <span className="text-accent">*</span>
              </label>
              <input
                {...register('code', {
                  required: 'El código es requerido',
                  minLength: {
                    value: 5,
                    message: 'El código debe tener al menos 5 caracteres',
                  },
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2 font-mono
                  ${errors.code ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
                placeholder="Ej: EICAP-2024-TRIAL-001"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-accent">{errors.code.message}</p>
              )}
            </div>

            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio <span className="text-accent">*</span>
              </label>
              <input
                type="date"
                {...register('fechaInicio', {
                  required: 'La fecha de inicio es requerida',
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.fechaInicio ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
              />
              {errors.fechaInicio && (
                <p className="mt-1 text-sm text-accent">{errors.fechaInicio.message}</p>
              )}
            </div>

            {/* Fecha Expiración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Expiración <span className="text-accent">*</span>
              </label>
              <input
                type="date"
                {...register('fechaExpiracion', {
                  required: 'La fecha de expiración es requerida',
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.fechaExpiracion ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
              />
              {errors.fechaExpiracion && (
                <p className="mt-1 text-sm text-accent">{errors.fechaExpiracion.message}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado <span className="text-accent">*</span>
              </label>
              <select
                {...register('estado', {
                  required: 'El estado es requerido',
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.estado ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="expirado">Expirado</option>
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-accent">{errors.estado.message}</p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo <span className="text-accent">*</span>
              </label>
              <select
                {...register('tipo', {
                  required: 'El tipo es requerido',
                })}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  ${errors.tipo ? 'border-accent' : 'border-gray-200'}
                  focus:border-primary focus:ring-4 focus:ring-primary/10
                  outline-none transition-all
                `}
              >
                <option value="trial">Trial</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-accent">{errors.tipo.message}</p>
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
                {keyId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
