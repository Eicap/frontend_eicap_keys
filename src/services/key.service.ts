import axiosInstance from "@/lib/axios";
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
  getKeysType: () => axiosInstance.get<KeyTypeListResponse>("/key-types"),

  // Get all permissions
  getPermissions: () => axiosInstance.get<PermissionListResponse>("/permissions"),

  // Get all keys
  getKeys: (limit?: number, offset?: number) => 
    axiosInstance.get<KeyListResponse>(`/keys`, {
      params: { limit, offset }
    }),

  getKeysByClient: (clientId: string) => axiosInstance.get<Key[]>(`/keys/client/${clientId}`),

  generateKeyCode: () => axiosInstance.post<GenerateCodeResponse>("/keys/generate"),

  getKeysInactive: () => axiosInstance.get<KeyListResponse>(`/keys/inactive`),

  createKeys: (data: GenerateKeysInput) => axiosInstance.post<KeyResponse>("/keys/bulk", data),

  // Create a new key
  createKey: (data: KeyCreateInput) => axiosInstance.post<KeyResponse>("/keys", data),

  // Update a key
  updateKey: (keyId: string, data: KeyUpdateInput) => axiosInstance.put<KeyResponse>(`/keys/${keyId}`, data),

  // Delete a key
  deleteKey: (keyId: string) => axiosInstance.delete(`/keys/${keyId}`),
};
