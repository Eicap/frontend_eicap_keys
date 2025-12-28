import z from "zod";

const KeyStatusCountSchema = z.object({
  status: z.string(),
  count: z.number(),
});

const RecentBatchSchema = z.object({
  id: z.string(),
  title: z.string(),
  quantity: z.number(),
  created_at: z.string(),
});

const DashboardStatsSchema = z.object({
  total_clients: z.number(),
  total_keys: z.number(),
  total_batches: z.number(),
  total_users: z.number(),
  keys_by_status: z.array(KeyStatusCountSchema),
  recent_batches: z.array(RecentBatchSchema),
  keys_expiring_month: z.number(),
  active_clients: z.number(),
});

type DashboardStats = z.infer<typeof DashboardStatsSchema>;
type KeyStatusCount = z.infer<typeof KeyStatusCountSchema>;
type RecentBatch = z.infer<typeof RecentBatchSchema>;

export { DashboardStatsSchema, KeyStatusCountSchema, RecentBatchSchema };

export type { DashboardStats, KeyStatusCount, RecentBatch };
