import { querykey } from "@/constants/querykey"
import keyTypeService from "@/services/key_type/key_type.service"
import { createQueryParams, type QueryParams } from "@/services/pagination.schema"
import { useQuery } from "@tanstack/react-query"

export function useGetAllKeyType(query: QueryParams) {
    return useQuery({
        queryKey: [querykey.key_types, query.offset, query.limit, query.search, query.search_field],
        queryFn: () => keyTypeService.getAll(createQueryParams(query.offset, query.limit, {
            search: query.search,
            search_field: query.search_field,
        })),
    })
}

export function useGetKeyType(keyTypeId: string) {
    return useQuery({
        queryKey: [querykey.key_type, keyTypeId],
        queryFn: () => keyTypeService.getById(keyTypeId),
        enabled: !!keyTypeId,
    })
}