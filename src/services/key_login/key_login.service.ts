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
}

export const keyLoginService = new KeyLoginService();
export default keyLoginService;
