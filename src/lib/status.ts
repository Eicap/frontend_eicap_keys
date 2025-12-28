import type { StatusEnum } from "@/services/enum.schema";

export const statusColors: Record<StatusEnum, string> = {
  ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  APPROVED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  EXPIRED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export const statusLabels: Record<StatusEnum, string> = {
  ACTIVE: "Activa",
  INACTIVE: "Inactiva",
  APPROVED: "Aprobada",
  PENDING: "Pendiente",
  EXPIRED: "Expirada",
};
