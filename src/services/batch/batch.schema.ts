import z from "zod";
import { StatusEnumSchema } from "../enum.schema";
import { KeySchema } from "../key/key.schema";

const keyStatusCountSchema = z.object({
  batch_id: z.string(),
  state: StatusEnumSchema,
  count: z.number().int().nonnegative(),
});

const BatchSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  quantity: z.number().int().nonnegative(),
  description: z.string(),
  key_status_counts: z.array(keyStatusCountSchema),
  keys: z.array(KeySchema).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

type Batch = z.infer<typeof BatchSchema>;

const BatchListSchema = z.array(BatchSchema);

type BatchList = z.infer<typeof BatchListSchema>;

const CreateBatchSchema = z.object({
  title: z.string().min(1).max(100),
  quantity: z.number().int().positive(),
  description: z.string().max(255).optional(),
  key_type_id: z.uuid(),
  client_id: z.uuid(),
});

type CreateBatch = z.infer<typeof CreateBatchSchema>;

const UpdateBacthSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
});

type UpdateBatch = z.infer<typeof UpdateBacthSchema>;

export { BatchSchema, BatchListSchema, CreateBatchSchema, UpdateBacthSchema };

export type { Batch, BatchList, CreateBatch, UpdateBatch };
