import { querykey } from "@/constants/querykey";
import keyService from "@/services/key/key.service";
import { createQueryParams, type QueryParams } from "@/services/pagination.schema";
import { useQuery } from "@tanstack/react-query";

export function useGetAllKey(query: QueryParams) {
  return useQuery({
    queryKey: [querykey.keys, query.offset, query.limit, query.search, query.search_field],
    queryFn: () =>
      keyService.getAll(
        createQueryParams(query.offset, query.limit, {
          search: query.search,
          search_field: query.search_field,
        })
      ),
  });
}

export function useGetKey(keyId: string) {
  return useQuery({
    queryKey: [querykey.key, keyId],
    queryFn: () => keyService.getById(keyId),
    enabled: !!keyId,
  });
}

export function useGetKeyHistory(keyId: string, query: QueryParams) {
  return useQuery({
    queryKey: [querykey.key_histories, keyId, query.offset, query.limit],
    queryFn: () => keyService.getKeyHistory(keyId, createQueryParams(query.offset, query.limit)),
    enabled: !!keyId,
  });
}

export function useGetKeyByCode(code: string) {
  return useQuery({
    queryKey: [querykey.key_codes, code],
    queryFn: () => keyService.getByCode(code),
    enabled: !!code,
  });
}

export function useGetKeysByClient(clientId: string, query: QueryParams) {
  return useQuery({
    queryKey: [querykey.keys, "client", clientId, query.offset, query.limit, query.search],
    queryFn: () =>
      keyService.getByClient(
        clientId,
        createQueryParams(query.offset, query.limit, {
          search: query.search,
        })
      ),
    enabled: !!clientId,
  });
}
