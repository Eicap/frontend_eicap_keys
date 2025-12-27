import { useMutation, useQueryClient } from '@tanstack/react-query'
import userService from '@/services/user/user.service'
import type { CreateUser, UpdateUser } from '@/services/user/user.schema'
import { useAppStore } from '@/store/app'
import type { QueryMutationOptions } from '@/types/mutation-options'
import { querykey } from '@/constants/querykey'


export function useCreateUserMutation(options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: CreateUser) => userService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.users] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
    })
}

export function useUpdateUserMutation(userId: string, options?: QueryMutationOptions) {
    const queryClient = useQueryClient()
    const closeDialog = useAppStore((state) => state.closeDialog)

    return useMutation({
        mutationFn: (data: UpdateUser) => userService.update(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.users] })
            queryClient.invalidateQueries({ queryKey: [querykey.user, userId] })
            if (options?.dialogId) {
                closeDialog(options.dialogId)
            }
        },
    })
}
