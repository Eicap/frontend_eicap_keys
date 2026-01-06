import axios from "axios";
import type { Paginated, QueryParams } from "../pagination.schema";
import type { Key, KeyUpdate } from "./key.schema";
import api from "@/lib/axios";

class KeyService {
  async getAll(opts: QueryParams): Promise<Paginated<Key>> {
    try {
      const response = await api.get("/keys", {
        params: opts,
      });
      console.log("🤣🤣🤣", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener las keys");
      }
      throw new Error("Error al obtener las keys");
    }
  }

  async getKeyHistory(keyId: string, opts: QueryParams): Promise<Paginated<Key>> {
    try {
      const response = await api.get(`/keys/${keyId}/history`, {
        params: opts,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener el historial de la key");
      }
      throw new Error("Error al obtener el historial de la key");
    }
  }

  async getById(id: string): Promise<Key> {
    try {
      const response = await api.get(`/keys/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener la key");
      }
      throw new Error("Error al obtener la key");
    }
  }

  async getByCode(code: string): Promise<Key> {
    try {
      const response = await api.get(`/keys/code/${code}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener la key por código");
      }
      throw new Error("Error al obtener la key por código");
    }
  }

  async getByClient(clientId: string, opts: QueryParams): Promise<Paginated<Key>> {
    try {
      const response = await api.get(`/keys/client/${clientId}`, {
        params: opts,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener las keys del cliente");
      }
      throw new Error("Error al obtener las keys del cliente");
    }
  }

  async update(id: string, data: KeyUpdate): Promise<void> {
    try {
      await api.patch(`/keys/${id}`, data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al actualizar la key");
      }
      throw new Error("Error al actualizar la key");
    }
  }
}

export const keyService = new KeyService();
export default keyService;
