import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/app'
import type { QueryMutationOptions } from '@/types/mutation-options'
import { querykey } from '@/constants/querykey'
import clientService from '@/services/client/client.service'
import type { Client, CreateClient, UpdateClient } from '@/services/client/client.schema'
import { toast } from 'sonner'


export function useCreateClientMutation(
    options?: QueryMutationOptions,
    onSelect?: (client: Client) => void,
) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: CreateClient) => clientService.create(data),
        onSuccess: (client: Client) => {
            queryClient.invalidateQueries({ queryKey: [querykey.clients] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
            if (onSelect) {
                onSelect(client)
            }
            toast.success('Cliente creado exitosamente')
        },
        onError: (error: any) => {
            toast.error(error instanceof Error ? error.message : 'Error al crear el cliente')
        }
    })
}

export function useUpdateClientMutation(clientId: string, options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: UpdateClient) => clientService.update(clientId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.clients] })
            queryClient.invalidateQueries({ queryKey: [querykey.client, clientId] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
            toast.success('Cliente actualizado exitosamente')
        },
        onError: (error: any) => {
            toast.error(error instanceof Error ? error.message : 'Error al actualizar el cliente')
        }
    })
}
