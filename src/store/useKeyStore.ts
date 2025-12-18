import { create } from "zustand";
import { keyService } from "@/services/key.service";
import { clientService } from "@/services/client.service";
import type { Key, KeyType, Permission, Client, KeyUpdateInput } from "@/services/types/responses";

export interface KeyStore {
  keys: Key[];
  inactiveKeys: Key[];
  keyTypes: KeyType[];
  permissions: Permission[];
  clients: Client[];
  searchQuery: string;
  isLoading: boolean;
  totalKeys: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  keysCache: Record<number, Key[]>;
  inactiveKeysCache: Key[] | null;
  lastInactiveFetch: number | null;

  // Actions
  fetchKeys: (limit?: number, offset?: number, forceRefresh?: boolean) => Promise<void>;
  fetchInactiveKeys: (forceRefresh?: boolean) => Promise<void>;
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
  createBulkKeys: (quantity: number) => Promise<void>;
  setSearchQuery: (query: string) => void;

  // Computed
  getFilteredKeys: () => Key[];
}

export const useKeyStore = create<KeyStore>((set, get) => ({
  keys: [],
  inactiveKeys: [],
  keyTypes: [],
  permissions: [],
  clients: [],
  searchQuery: "",
  isLoading: false,
  totalKeys: 0,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 0,
  keysCache: {},
  inactiveKeysCache: null,
  lastInactiveFetch: null,

  fetchKeys: async (limit = 10, offset = 0, forceRefresh = false) => {
    try {
      const pageNumber = Math.floor(offset / limit) + 1;
      const { keysCache } = get();
      
      // Si ya tenemos los datos en caché y no es un refresh forzado, usarlos
      if (!forceRefresh && keysCache[pageNumber]) {
        set({ 
          keys: keysCache[pageNumber],
          currentPage: pageNumber,
        });
        return;
      }

      set({ isLoading: true });
      const response = await keyService.getKeys(limit, offset);
      const { data, total, pages } = response.data;
      
      // Guardar en caché
      const newCache = { ...keysCache, [pageNumber]: data };
      
      set({ 
        keys: data, 
        totalKeys: total,
        totalPages: pages,
        currentPage: pageNumber,
        itemsPerPage: limit,
        keysCache: newCache,
        isLoading: false 
      });
    } catch (error) {
      console.error("Error fetching keys:", error);
      set({ isLoading: false });
    }
  },

  fetchInactiveKeys: async (forceRefresh = false) => {
    const { inactiveKeysCache, lastInactiveFetch } = get();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    const now = Date.now();

    // Si hay caché válido y no es refresh forzado, usar caché
    if (!forceRefresh && inactiveKeysCache && lastInactiveFetch && (now - lastInactiveFetch) < CACHE_DURATION) {
      set({ inactiveKeys: inactiveKeysCache });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await keyService.getKeysInactive();
      const inactiveData = response.data.data;
      set({ 
        inactiveKeys: inactiveData,
        inactiveKeysCache: inactiveData,
        lastInactiveFetch: now,
        isLoading: false 
      });
    } catch (error) {
      console.error("Error fetching inactive keys:", error);
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
      // Limpiar caché al crear una nueva key
      set({ keysCache: {} });
      await get().fetchKeys(get().itemsPerPage, 0, true);
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
      // Limpiar caché al actualizar
      const { currentPage, itemsPerPage } = get();
      set({ keysCache: {} });
      await get().fetchKeys(itemsPerPage, (currentPage - 1) * itemsPerPage, true);
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
      // Limpiar caché al eliminar
      const { currentPage, itemsPerPage } = get();
      set({ keysCache: {} });
      await get().fetchKeys(itemsPerPage, (currentPage - 1) * itemsPerPage, true);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error deleting key:", error);
      set({ isLoading: false });
    }
  },

  createBulkKeys: async (quantity) => {
    try {
      set({ isLoading: true });
      await keyService.createKeys({ quantity });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating bulk keys:", error);
      set({ isLoading: false });
      throw error;
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
