import { querykey } from "@/constants/querykey"
import batchService from "@/services/batch/batch.service"
import { createQueryParams, type QueryParams } from "@/services/pagination.schema"
import { useQuery } from "@tanstack/react-query"

export function useQueryBatch(query: QueryParams) {
    return useQuery({
    queryKey: [querykey.batchs, query.offset, query.limit, query.search],
    queryFn: () => batchService.getAll(createQueryParams(query.offset, query.limit, {
      search: query.search,
    })),
  })
}

export function useGetBatch(batchId: string) {
  return useQuery({
    queryKey: [querykey.batch, batchId],
    queryFn: () => batchService.getById(batchId),
    enabled: !!batchId,
  })
}