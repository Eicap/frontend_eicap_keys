import { create } from "zustand";
import { clientService } from "../services/client.service";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

interface ClientStore {
  clients: Client[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  clientsCache: Client[] | null;
  lastFetch: number | null;

  // Actions
  setClients: (clients: Client[]) => void;
  fetchClients: (forceRefresh?: boolean) => Promise<void>;
  addClient: (clientData: { name: string; email: string; phone: string }) => Promise<void>;
  updateClient: (id: string, clientData: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getFilteredClients: () => Client[];
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  searchQuery: "",
  isLoading: false,
  error: null,
  clientsCache: null,
  lastFetch: null,

  setClients: (clients) => set({ clients }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  fetchClients: async (forceRefresh = false) => {
    const { clientsCache, lastFetch } = get();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    const now = Date.now();

    // Si hay caché válido y no es refresh forzado, usar caché
    if (!forceRefresh && clientsCache && lastFetch && (now - lastFetch) < CACHE_DURATION) {
      set({ clients: clientsCache });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await clientService.getClients();
      const clientsData = response.data.data;
      set({ 
        clients: clientsData,
        clientsCache: clientsData,
        lastFetch: now
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar clientes";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  addClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.createClient(clientData);
      // Limpiar caché y recargar
      set({ clientsCache: null });
      await get().fetchClients(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear cliente";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id, clientData) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.updateClient(id, clientData);
      // Limpiar caché y recargar
      set({ clientsCache: null });
      await get().fetchClients(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar cliente";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.deleteClient(id);
      // Limpiar caché y recargar
      set({ clientsCache: null });
      await get().fetchClients(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar cliente";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredClients: () => {
    const { clients, searchQuery } = get();
    if (!searchQuery) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query)
    );
  },
}));
