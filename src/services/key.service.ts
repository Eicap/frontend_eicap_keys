import axiosInstance from "@/lib/axios";
import type {
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
  getKeys: () => axiosInstance.get<KeyListResponse>(`/keys`),

  // Create a new key
  createKey: (data: KeyCreateInput) => axiosInstance.post<KeyResponse>("/keys", data),

  // Update a key
  updateKey: (keyId: string, data: KeyUpdateInput) => axiosInstance.put<KeyResponse>(`/keys/${keyId}`, data),

  // Delete a key
  deleteKey: (keyId: string) => axiosInstance.delete(`/keys/${keyId}`),
};
