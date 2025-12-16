import axiosInstance from "@/lib/axios";
import type { ClientCreateInput, ClientUpdateInput, ClientListResponse, ClientResponse } from "./types/responses";

export const clientService = {
  // Get all clients
  getClients: () => axiosInstance.get<ClientListResponse>("/clients"),

  // Create a new client
  createClient: (data: ClientCreateInput) => axiosInstance.post<ClientResponse>("/clients", data),

  // Update a client
  updateClient: (clientId: string, data: ClientUpdateInput) =>
    axiosInstance.put<ClientResponse>(`/clients/${clientId}`, data),

  // Delete a client
  deleteClient: (clientId: string) => axiosInstance.delete(`/clients/${clientId}`),
};
