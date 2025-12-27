import api from "@/lib/axios";
import type {
  GenerateCodeResponse,
  GenerateKeysInput,
  Key,
  KeyCreateInput,
  KeyListResponse,
  KeyResponse,
  KeyTypeListResponse,
  KeyUpdateInput,
  PermissionListResponse,
} from "./types/responses";

export const keyService = {
  // Get all key types
  getKeysType: () => api.get<KeyTypeListResponse>("/key-types"),

  // Get all permissions
  getPermissions: () => api.get<PermissionListResponse>("/permissions"),

  // Get all keys
  getKeys: (limit?: number, offset?: number) =>
    api.get<KeyListResponse>(`/keys`, {
      params: { limit, offset },
    }),

  getKeysByClient: (clientId: string) => api.get<Key[]>(`/keys/client/${clientId}`),

  generateKeyCode: () => api.post<GenerateCodeResponse>("/keys/generate"),

  getKeysInactive: (limit?: number, offset?: number) =>
    api.get<KeyListResponse>(`/keys/inactive`, {
      params: { limit, offset },
    }),

  createKeys: (data: GenerateKeysInput) => api.post<KeyResponse>("/keys/bulk", data),

  // Create a new key
  createKey: (data: KeyCreateInput) => api.post<KeyResponse>("/keys", data),

  // Update a key
  updateKey: (keyId: string, data: KeyUpdateInput) => api.put<KeyResponse>(`/keys/${keyId}`, data),

  // Delete a key
  deleteKey: (keyId: string) => api.delete(`/keys/${keyId}`),
};
