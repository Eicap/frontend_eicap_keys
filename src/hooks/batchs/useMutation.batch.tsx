import { querykey } from "@/constants/querykey"
import type { CreateBatch, UpdateBatch } from "@/services/batch/batch.schema"
import batchService from "@/services/batch/batch.service"
import { useAppStore } from "@/store/app"
import type { QueryMutationOptions } from "@/types/mutation-options"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateBatchMutation(options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: CreateBatch) => batchService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.batchs] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
    })
}

export function useUpdateBatchMutation(batchId: string, options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: UpdateBatch) => batchService.update(batchId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.batchs] })
            queryClient.invalidateQueries({ queryKey: [querykey.batch, batchId] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
    })
}