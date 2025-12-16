import { create } from 'zustand';

export interface KeyItem {
  id: string;
  code: string;
  fechaInicio: Date;
  fechaExpiracion: Date;
  estado: 'activo' | 'inactivo' | 'expirado';
  tipo: 'trial' | 'premium' | 'enterprise';
  createdAt: Date;
}

interface KeyStore {
  keys: KeyItem[];
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  setKeys: (keys: KeyItem[]) => void;
  addKey: (key: Omit<KeyItem, 'id' | 'createdAt'>) => void;
  updateKey: (id: string, key: Partial<KeyItem>) => void;
  deleteKey: (id: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Computed
  getFilteredKeys: () => KeyItem[];
}

export const useKeyStore = create<KeyStore>((set, get) => ({
  keys: [
    {
      id: '1',
      code: 'EICAP-2024-TRIAL-001',
      fechaInicio: new Date('2024-01-01'),
      fechaExpiracion: new Date('2024-12-31'),
      estado: 'activo',
      tipo: 'trial',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      code: 'EICAP-2024-PREM-002',
      fechaInicio: new Date('2024-02-01'),
      fechaExpiracion: new Date('2025-02-01'),
      estado: 'activo',
      tipo: 'premium',
      createdAt: new Date('2024-02-01'),
    },
    {
      id: '3',
      code: 'EICAP-2023-ENT-003',
      fechaInicio: new Date('2023-06-01'),
      fechaExpiracion: new Date('2024-06-01'),
      estado: 'expirado',
      tipo: 'enterprise',
      createdAt: new Date('2023-06-01'),
    },
  ],
  searchQuery: '',
  isLoading: false,

  setKeys: (keys) => set({ keys }),

  addKey: (keyData) => {
    const newKey: KeyItem = {
      ...keyData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    set((state) => ({
      keys: [...state.keys, newKey],
    }));
  },

  updateKey: (id, keyData) => {
    set((state) => ({
      keys: state.keys.map((key) =>
        key.id === id ? { ...key, ...keyData } : key
      ),
    }));
  },

  deleteKey: (id) => {
    set((state) => ({
      keys: state.keys.filter((key) => key.id !== id),
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredKeys: () => {
    const { keys, searchQuery } = get();
    if (!searchQuery) return keys;

    const query = searchQuery.toLowerCase();
    return keys.filter(
      (key) =>
        key.code.toLowerCase().includes(query) ||
        key.tipo.toLowerCase().includes(query) ||
        key.estado.toLowerCase().includes(query)
    );
  },
}));
