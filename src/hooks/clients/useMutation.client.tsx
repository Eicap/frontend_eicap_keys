import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/app'
import type { QueryMutationOptions } from '@/types/mutation-options'
import { querykey } from '@/constants/querykey'
import clientService from '@/services/client/client.service'
import type { CreateClient, UpdateClient } from '@/services/client/client.schema'


export function useCreateClientMutation(options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: CreateClient) => clientService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.clients] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
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
        },
    })
}
