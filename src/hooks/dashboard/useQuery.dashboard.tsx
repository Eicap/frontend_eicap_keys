import { querykey } from "@/constants/querykey";
import dashboardService from "@/services/dashboard/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: [querykey.dashboard],
    queryFn: () => dashboardService.getStats(),
  });
}
