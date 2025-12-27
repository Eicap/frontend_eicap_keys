import { querykey } from "@/constants/querykey"
import clientService from "@/services/client/client.service"
import { createQueryParams, type QueryParams } from "@/services/pagination.schema"
import { useQuery } from "@tanstack/react-query"

export function useQueryClient(query: QueryParams) {
    return useQuery({
    queryKey: [querykey.clients, query.offset, query.limit, query.search, query.search_field],
    queryFn: () => clientService.getAll(createQueryParams(query.offset, query.limit, {
      search: query.search,
      search_field: query.search_field,
    })),
  })
}

export function useGetClient(clientId: string) {
  return useQuery({
    queryKey: [querykey.client, clientId],
    queryFn: () => clientService.get(clientId),
    enabled: !!clientId,
  })
}