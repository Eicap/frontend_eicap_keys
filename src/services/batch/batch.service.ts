import api from "@/lib/axios";
import type { Paginated, QueryParams } from "../pagination.schema";
import type { Batch, CreateBatch, UpdateBatch } from "./batch.schema";
import axios from "axios";

class BatchService {
    async getAll(options: QueryParams): Promise<Paginated<Batch>> {
        try {
            const response = await api.get('/batches', {
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

    async getById(batchId: string): Promise<Batch> {
        try {
            const response = await api.get(`/batches/${batchId}`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener el lote')
            }
            throw new Error('Error al obtener el lote')
        }
    }

    async create(data: CreateBatch): Promise<void> {
        try {
            await api.post('/batches', data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al crear el lote')
            }
            throw new Error('Error al crear el lote')
        }
    }

    async update(batchId: string, data: UpdateBatch): Promise<void> {
        try {
            await api.patch(`/batches/${batchId}`, data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al actualizar el lote')
            }
            throw new Error('Error al actualizar el lote')
        }
    }
}

const batchService = new BatchService();
export default batchService;