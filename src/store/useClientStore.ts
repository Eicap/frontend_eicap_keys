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

  // Actions
  setClients: (clients: Client[]) => void;
  fetchClients: () => Promise<void>;
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

  setClients: (clients) => set({ clients }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientService.getClients();
      set({ clients: response.data.data });
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
      // Recargar lista después de crear
      await get().fetchClients();
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
      // Recargar lista después de actualizar
      await get().fetchClients();
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
      // Recargar lista después de eliminar
      await get().fetchClients();
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
