import axios from "axios";
import type { Paginated, QueryParams } from "../pagination.schema";
import type { KeyLogin } from "./key_login.schema";
import api from "@/lib/axios";

class KeyLoginService {
  async getAll(opts: QueryParams): Promise<Paginated<KeyLogin>> {
    try {
      const response = await api.get("/key-logins", {
        params: opts,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener los logins");
      }
      throw new Error("Error al obtener los logins");
    }
  }

  async getByKeyId(keyId: string): Promise<KeyLogin[]> {
    try {
      const response = await api.get(`/key-logins/key/${keyId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener los logins de la key");
      }
      throw new Error("Error al obtener los logins de la key");
    }
  }

  async getById(id: string): Promise<KeyLogin> {
    try {
      const response = await api.get(`/key-logins/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener el login");
      }
      throw new Error("Error al obtener el login");
    }
  }

  async deleteComputerConnections(keyId: string): Promise<void> {
    try {
      await api.delete(`/key-logins/${keyId}/computer-connections`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al eliminar las conexiones de la key");
      }
      throw new Error("Error al eliminar las conexiones de la key");
    }
  }

  async deleteKeyConnections(keyId: string): Promise<void> {
    try {
      await api.delete(`/key-logins/${keyId}/key-connections`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al eliminar las conexiones de la key");
      }
      throw new Error("Error al eliminar las conexiones de la key");
    }
  }

  async deleteOneConnections(keyId: string, computerId: string): Promise<void> {
    try {
      await api.delete(`/key-logins/${keyId}/${computerId}/connection`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al eliminar la conexión");
      }
      throw new Error("Error al eliminar la conexión");
    } 
  }
}

export const keyLoginService = new KeyLoginService();
export default keyLoginService;
