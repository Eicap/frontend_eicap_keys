import { querykey } from "@/constants/querykey";
import keyLoginService from "@/services/key_login/key_login.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationDeleteComputerConnections(keyId: string) {
    const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: () => keyLoginService.deleteComputerConnections(keyId),
    onSuccess: () => {
      // Aquí puedes invalidar la query de conexiones para que se refresque la lista
      queryClient.invalidateQueries({ queryKey: [querykey.computer_connections, keyId] });
    },
  });
}

export function useMutationDeleteKeyConnections(keyId: string) {
    const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: () => keyLoginService.deleteKeyConnections(keyId),
    onSuccess: () => {
      // Aquí puedes invalidar la query de conexiones para que se refresque la lista
      queryClient.invalidateQueries({ queryKey: [querykey.key_connections, keyId] });
    },
  });
}

export function useMutationDeleteOneConnection(keyId?: string, computerId?: string) {
    const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: ({key, computer}:{key: string, computer: string}) => keyLoginService.deleteOneConnections(key, computer),
    onSuccess: () => {
      // Aquí puedes invalidar la query de conexiones para que se refresque la lista
      queryClient.invalidateQueries({ queryKey: [querykey.key_connections, keyId] });
      queryClient.invalidateQueries({ queryKey: [querykey.computer_connections, computerId] });
    },
  });
}