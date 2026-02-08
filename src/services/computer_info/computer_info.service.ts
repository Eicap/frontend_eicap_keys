import api from "@/lib/axios"
import type { Paginated, QueryParams } from "../pagination.schema"
import type { ComputerInfo, UpdateComputerInfo } from "./computer_info.schema"
import axios from "axios"
import type { Key } from "../key/key.schema"

class ComputerInfoService {
    async getAll(options: QueryParams): Promise<Paginated<ComputerInfo>> {
        try {
            const response = await api.get('/computer-info', {
                params: options,
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener la información de la computadora')
            }
            throw new Error('Error al obtener la información de la computadora')
        }
    }

    async update(id: string, data: UpdateComputerInfo): Promise<void> {
        try {
            await api.patch(`/computer-info/${id}`, data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al actualizar la información de la computadora')
            }
            throw new Error('Error al actualizar la información de la computadora')
        }
    }

    async getConnections(id: string): Promise<Key[]> {
        try {
            const response = await api.get(`/computer-info/${id}/connections`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener las conexiones de la computadora')
            }
            throw new Error('Error al obtener las conexiones de la computadora')
        }
    }
}

const computerInfoService = new ComputerInfoService()
export default computerInfoService