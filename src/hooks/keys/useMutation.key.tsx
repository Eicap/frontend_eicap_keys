import type { QueryMutationOptions } from "@/types/mutation-options";
import { useAppStore } from "@/store/app";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { KeyUpdate } from "@/services/key/key.schema";
import keyService from "@/services/key/key.service";
import { querykey } from "@/constants/querykey";

export function useUpdateKeyMutation(keyId: string, options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: KeyUpdate) => keyService.update(keyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.keys] })
            queryClient.invalidateQueries({ queryKey: [querykey.key, keyId] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
    })
} 