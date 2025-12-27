import { querykey } from "@/constants/querykey";
import { createQueryParams, type QueryParams } from "@/services/pagination.schema";
import userService from "@/services/user/user.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryUser(query: QueryParams) {
    return useQuery({
    queryKey: [querykey.users, query.offset, query.limit, query.search, query.search_field],
    queryFn: () => userService.getAll(createQueryParams(query.offset, query.limit, {
      search: query.search,
      search_field: query.search_field,
    })),
  })
}

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: [querykey.user, userId],
    queryFn: () => userService.get(userId),
    enabled: !!userId,
  })
}