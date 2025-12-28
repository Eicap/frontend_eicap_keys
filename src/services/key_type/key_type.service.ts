import api from "@/lib/axios";
import type { Paginated, QueryParams } from "../pagination.schema";
import type { CreateKeyType, KeyType, UpdateKeyType, UpdatePermissionsKeyType } from "./key_type.schema";
import axios from "axios";

class KeyTypeService {
    async getAll(opts: QueryParams): Promise<Paginated<KeyType>> {
        try {
            const response = await api.get('/key-types', {
                params: opts,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener las keys');
            }
            throw new Error('Error al obtener las keys');
        }
    }

    async getById(id: string): Promise<KeyType> {
        try {
            const response = await api.get(`/key-types/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener la key');
            }
            throw new Error('Error al obtener la key');
        }
    }

    async create(data: CreateKeyType): Promise<void> {
        try {
            await api.post('/key-types', data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al crear la key');
            }
            throw new Error('Error al crear la key');
        }
    }

    async update(id: string, data: UpdateKeyType): Promise<void> {
        try {
            await api.patch(`/key-types/${id}`, data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al actualizar la key');
            }
            throw new Error('Error al actualizar la key');
        }
    }

    async updatePermissions(id: string, data: UpdatePermissionsKeyType): Promise<void> {
        try {
            await api.patch(`/key-types/${id}/permissions`, data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al actualizar los permisos de la key');
            }
            throw new Error('Error al actualizar los permisos de la key');
        }
    }
}

const keyTypeService = new KeyTypeService();
export default keyTypeService;