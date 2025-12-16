import { create } from 'zustand';

export interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  createdAt: Date;
}

interface ClientStore {
  clients: Client[];
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  setClients: (clients: Client[]) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Computed
  getFilteredClients: () => Client[];
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '+1234567890',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      nombre: 'María García',
      email: 'maria.garcia@example.com',
      telefono: '+1234567891',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      nombre: 'Carlos López',
      email: 'carlos.lopez@example.com',
      telefono: '+1234567892',
      createdAt: new Date('2024-03-10'),
    },
  ],
  searchQuery: '',
  isLoading: false,

  setClients: (clients) => set({ clients }),

  addClient: (clientData) => {
    const newClient: Client = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    set((state) => ({
      clients: [...state.clients, newClient],
    }));
  },

  updateClient: (id, clientData) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...clientData } : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredClients: () => {
    const { clients, searchQuery } = get();
    if (!searchQuery) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.nombre.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.telefono.includes(query)
    );
  },
}));
