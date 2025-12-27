import api from "@/lib/axios"
import type { Paginated, QueryParams } from "../pagination.schema"
import axios from "axios"
import type { Client, CreateClient, UpdateClient } from "./client.schema"

export class ClientService {
    async getAll(options: QueryParams): Promise<Paginated<Client>> {
        try {
            const response = await api.get('/clients', {
                params: options,
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener los clientes')
            }
            throw new Error('Error al obtener los clientes')
        }
    }

    async get(id: string): Promise<Client> {
        try {
            const response = await api.get(`/clients/${id}`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener el cliente')
            }
            throw new Error('Error al obtener el cliente')
        }
    }

    async create(data: CreateClient): Promise<void> {
        try {
            await api.post('/clients', data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al crear el cliente')
            }
            throw new Error('Error al crear el cliente')
        }
    }

    async update(id: string, data: UpdateClient): Promise<void> {
        try {
            await api.patch(`/clients/${id}`, data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al actualizar el cliente')
            }
            throw new Error('Error al actualizar el cliente')
        }
    }
}

const clientService = new ClientService()
export default clientService