import { querykey } from "@/constants/querykey"
import type { UpdateComputerInfo } from "@/services/computer_info/computer_info.schema"
import computerInfoService from "@/services/computer_info/computer_info.service"
import { useAppStore } from "@/store/app"
import type { QueryMutationOptions } from "@/types/mutation-options"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateComputerInfoMutation(computerInfoId: string, options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: UpdateComputerInfo) => computerInfoService.update(computerInfoId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.computers_info] })
            queryClient.invalidateQueries({ queryKey: [querykey.computer_info, computerInfoId] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
    })
}