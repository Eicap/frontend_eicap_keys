import { querykey } from "@/constants/querykey";
import keyLoginService from "@/services/key_login/key_login.service";
import { createQueryParams, type QueryParams } from "@/services/pagination.schema";
import { useQuery } from "@tanstack/react-query";

export function useGetAllKeyLogin(query: QueryParams) {
  return useQuery({
    queryKey: [querykey.key_logins, query.offset, query.limit],
    queryFn: () => keyLoginService.getAll(createQueryParams(query.offset, query.limit)),
  });
}

export function useGetKeyLoginsByKeyId(keyId: string) {
  return useQuery({
    queryKey: [querykey.key_logins, "key", keyId],
    queryFn: () => keyLoginService.getByKeyId(keyId),
    enabled: !!keyId,
  });
}

export function useGetKeyLogin(id: string) {
  return useQuery({
    queryKey: [querykey.key_login, id],
    queryFn: () => keyLoginService.getById(id),
    enabled: !!id,
  });
}
