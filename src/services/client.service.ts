import api from "@/lib/axios";
import type { ClientCreateInput, ClientUpdateInput, ClientListResponse, ClientResponse } from "./types/responses";

export const clientService = {
  // Get all clients
  getClients: () => api.get<ClientListResponse>("/clients"),

  // Create a new client
  createClient: (data: ClientCreateInput) => api.post<ClientResponse>("/clients", data),

  // Update a client
  updateClient: (clientId: string, data: ClientUpdateInput) =>
    api.put<ClientResponse>(`/clients/${clientId}`, data),

  // Delete a client
  deleteClient: (clientId: string) => api.delete(`/clients/${clientId}`),
};
