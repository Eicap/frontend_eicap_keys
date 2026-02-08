import { querykey } from "@/constants/querykey";
import computerInfoService from "@/services/computer_info/computer_info.service";
import { createQueryParams, type QueryParams } from "@/services/pagination.schema";
import { useQuery } from "@tanstack/react-query";

export function useQueryComputerInfo(query: QueryParams) {
    return useQuery({
    queryKey: [querykey.computers_info, query.offset, query.limit, query.search, query.search_field],
    queryFn: () => computerInfoService.getAll(createQueryParams(query.offset, query.limit, {
      search: query.search,
      search_field: query.search_field,
    })),
  })
}

export function useComputerConnections(id: string) {
    return useQuery({
    queryKey: [querykey.computer_connections, id],
    queryFn: () => computerInfoService.getConnections(id),
  })
}