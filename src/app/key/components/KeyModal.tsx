import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { useKeyStore } from "../../../store/useKeyStore";
import * as Dialog from "@radix-ui/react-dialog";

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyId?: string | null;
}

interface KeyFormData {
  code: string;
  init_date: string;
  due_date: string;
  state: string;
  key_type_id: string;
  client_id?: string;
  permissions?: string[];
}

export default function KeyModal({ isOpen, onClose, keyId }: KeyModalProps) {
  const { keys, keyTypes, permissions, clients, fetchKeyTypes, fetchPermissions, fetchClients, createKey, updateKey } =
    useKeyStore();

  const [selectedKeyType, setSelectedKeyType] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<KeyFormData>();

  const key = keyId ? keys.find((k) => k.id === keyId) : null;
  const watchKeyType = watch("key_type_id");

  // Fetch initial data
  useEffect(() => {
    if (isOpen) {
      fetchKeyTypes();
      fetchPermissions();
      fetchClients();
    }
  }, [isOpen, fetchKeyTypes, fetchPermissions, fetchClients]);

  // Update selected key type when form changes
  useEffect(() => {
    if (watchKeyType) {
      const keyType = keyTypes.find((kt) => kt.id === watchKeyType);
      setSelectedKeyType(keyType?.name || "");
    }
  }, [watchKeyType, keyTypes]);

  // Reset form when modal opens/closes or key changes
  useEffect(() => {
    if (key) {
      reset({
        code: key.code,
        init_date: key.init_date,
        due_date: key.due_date,
        state: key.state,
        key_type_id: key.key_type.id,
        client_id: key.client_id || "",
      });
      setSelectedKeyType(key.key_type.name);
      setSelectedPermissions(key.permissions.map((p) => p.id));
    } else {
      const today = new Date().toISOString().split("T")[0];
      const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      reset({
        code: "",
        init_date: today,
        due_date: nextYear,
        state: "active",
        key_type_id: "",
        client_id: "",
      });
      setSelectedKeyType("");
      setSelectedPermissions([]);
    }
  }, [key, reset, isOpen]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const onSubmit = async (data: KeyFormData) => {
    try {
      setIsSubmitting(true);

      const keyType = keyTypes.find((kt) => kt.id === data.key_type_id);
      const isEmpresarial = keyType?.name === "empresarial";
      console.log("🤣🤣🤣", data);

      // Always include client_id and permissions
      // For estudiantil: client_id = "", permissions = []
      // For empresarial: use actual values
      const submitData = {
        code: data.code,
        init_date: data.init_date,
        due_date: data.due_date,
        state: data.state,
        key_type_id: data.key_type_id,
        client_id: isEmpresarial ? data.client_id || "" : "",
        permissions: isEmpresarial ? selectedPermissions : [],
      };

      console.log("Submitting data:", submitData);

      if (keyId) {
        await updateKey(keyId, submitData);
      } else {
        await createKey(submitData);
      }

      onClose();
      reset();
      setSelectedPermissions([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al guardar la key. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmpresarial = selectedKeyType === "empresarial";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl animate-scale-in z-50 max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                {keyId ? "Editar Key" : "Nueva Key"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {keyId ? "Modifica los datos de la key" : "Completa el formulario para crear una nueva key"}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="key-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código <span className="text-accent">*</span>
                  </label>
                  <input
                    {...register("code", {
                      required: "El código es requerido",
                      minLength: {
                        value: 3,
                        message: "El código debe tener al menos 3 caracteres",
                      },
                    })}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 font-mono
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      ${errors.code ? "border-accent" : "border-gray-200 dark:border-gray-700"}
                      focus:border-primary focus:ring-4 focus:ring-primary/10
                      outline-none transition-all
                    `}
                    placeholder="Ej: Eee-t98"
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 font-medium">{errors.code.message}</p>
                  )}
                </div>

                {/* Key Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Key <span className="text-accent">*</span>
                  </label>
                  <select
                    {...register("key_type_id", {
                      required: "El tipo de key es requerido",
                    })}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      ${errors.key_type_id ? "border-accent" : "border-gray-200 dark:border-gray-700"}
                      focus:border-primary focus:ring-4 focus:ring-primary/10
                      outline-none transition-all
                    `}
                  >
                    <option value="">Selecciona un tipo</option>
                    {keyTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.key_type_id && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 font-medium">
                      {errors.key_type_id.message}
                    </p>
                  )}
                </div>

                {/* Client - Only for empresarial */}
                {isEmpresarial && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cliente <span className="text-accent">*</span>
                    </label>
                    <select
                      {...register("client_id", {
                        required: isEmpresarial ? "El cliente es requerido para keys empresariales" : false,
                      })}
                      className={`
                        w-full px-4 py-3 rounded-lg border-2
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        ${errors.client_id ? "border-accent" : "border-gray-200 dark:border-gray-700"}
                        focus:border-primary focus:ring-4 focus:ring-primary/10
                        outline-none transition-all
                      `}
                    >
                      <option value="">Selecciona un cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {errors.client_id && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400 font-medium">
                        {errors.client_id.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Inicio <span className="text-accent">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("init_date", {
                      required: "La fecha de inicio es requerida",
                    })}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      ${errors.init_date ? "border-accent" : "border-gray-200 dark:border-gray-700"}
                      focus:border-primary focus:ring-4 focus:ring-primary/10
                      outline-none transition-all
                    `}
                  />
                  {errors.init_date && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 font-medium">
                      {errors.init_date.message}
                    </p>
                  )}
                </div>

                {/* Fecha Expiración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Expiración <span className="text-accent">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("due_date", {
                      required: "La fecha de expiración es requerida",
                    })}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      ${errors.due_date ? "border-accent" : "border-gray-200 dark:border-gray-700"}
                      focus:border-primary focus:ring-4 focus:ring-primary/10
                      outline-none transition-all
                    `}
                  />
                  {errors.due_date && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 font-medium">{errors.due_date.message}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado <span className="text-accent">*</span>
                  </label>
                  <select
                    {...register("state", {
                      required: "El estado es requerido",
                    })}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      ${errors.state ? "border-accent" : "border-gray-200 dark:border-gray-700"}
                      focus:border-primary focus:ring-4 focus:ring-primary/10
                      outline-none transition-all
                    `}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 font-medium">{errors.state.message}</p>
                  )}
                </div>

                {/* Permissions - Only for empresarial */}
                {isEmpresarial && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Permisos <span className="text-accent">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                      {permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary cursor-pointer transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {permission.name.charAt(0).toUpperCase() + permission.name.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                    {isEmpresarial && selectedPermissions.length === 0 && (
                      <p className="mt-2 text-sm text-amber-600 dark:text-amber-500">
                        Se recomienda seleccionar al menos un permiso
                      </p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Fixed Footer with Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="key-form"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#db1d25] to-[#ff3d47] text-white font-semibold hover:from-[#c01a21] hover:to-[#db1d25] shadow-lg shadow-red-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : keyId ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
