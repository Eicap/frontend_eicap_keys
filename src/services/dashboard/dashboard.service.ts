import api from "@/lib/axios";
import type { DashboardStats } from "./dashboard.schema";
import axios from "axios";

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error al obtener estadísticas del dashboard");
      }
      throw new Error("Error al obtener estadísticas del dashboard");
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
