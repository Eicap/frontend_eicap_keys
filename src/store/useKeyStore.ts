import { create } from "zustand";
import { keyService } from "@/services/key.service";
import { clientService } from "@/services/client.service";
import type { Key, KeyType, Permission, Client, KeyUpdateInput } from "@/services/types/responses";

export interface KeyStore {
  keys: Key[];
  keyTypes: KeyType[];
  permissions: Permission[];
  clients: Client[];
  searchQuery: string;
  isLoading: boolean;

  // Actions
  fetchKeys: () => Promise<void>;
  fetchKeyTypes: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  fetchClients: () => Promise<void>;
  generateKeyCode: () => Promise<string>;
  createKey: (data: {
    code: string;
    init_date: string;
    due_date: string;
    state: string;
    key_type_id: string;
    client_id?: string;
    permissions?: string[];
  }) => Promise<void>;
  updateKey: (id: string, data: KeyUpdateInput) => Promise<void>;
  deleteKey: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;

  // Computed
  getFilteredKeys: () => Key[];
}

export const useKeyStore = create<KeyStore>((set, get) => ({
  keys: [],
  keyTypes: [],
  permissions: [],
  clients: [],
  searchQuery: "",
  isLoading: false,

  fetchKeys: async () => {
    try {
      set({ isLoading: true });
      const response = await keyService.getKeys();
      set({ keys: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching keys:", error);
      set({ isLoading: false });
    }
  },

  fetchKeyTypes: async () => {
    try {
      const response = await keyService.getKeysType();
      set({ keyTypes: response.data.data.data });
    } catch (error) {
      console.error("Error fetching key types:", error);
    }
  },

  fetchPermissions: async () => {
    try {
      const response = await keyService.getPermissions();
      set({ permissions: response.data.data });
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  },

  fetchClients: async () => {
    try {
      const response = await clientService.getClients();
      set({ clients: response.data.data });
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  },

  generateKeyCode: async () => {
    try {
      const response = await keyService.generateKeyCode();
      return response.data.code;
    } catch (error) {
      console.error("Error generating key code:", error);
      throw error;
    }
  },

  createKey: async (data) => {
    try {
      set({ isLoading: true });
      await keyService.createKey(data);
      await get().fetchKeys();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating key:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateKey: async (id, data) => {
    console.log("Updating key with ID:", id, "Data:", data);
    try {
      set({ isLoading: true });
      await keyService.updateKey(id, data);
      await get().fetchKeys();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating key:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteKey: async (id) => {
    try {
      set({ isLoading: true });
      await keyService.deleteKey(id);
      await get().fetchKeys();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error deleting key:", error);
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredKeys: () => {
    const { keys, searchQuery } = get();
    if (!searchQuery) return keys;

    const query = searchQuery.toLowerCase();
    return keys.filter(
      (key) =>
        key.code.toLowerCase().includes(query) ||
        key.key_type.name.toLowerCase().includes(query) ||
        key.state.toLowerCase().includes(query) ||
        key.client_name?.toLowerCase().includes(query) ||
        key.permissions.some((p) => p.name.toLowerCase().includes(query))
    );
  },
}));
