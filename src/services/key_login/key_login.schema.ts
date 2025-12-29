import z from "zod";

const ComputerInfoSchema = z.object({
  id: z.uuid(),
  computer_name: z.string(),
  ip: z.string(),
  os: z.string(),
  state: z.string(),
  key_login_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

const KeyLoginSchema = z.object({
  id: z.uuid(),
  date: z.string(),
  key_id: z.uuid(),
  ip: z.string(),
  computer_info: ComputerInfoSchema.optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

type KeyLogin = z.infer<typeof KeyLoginSchema>;
type ComputerInfo = z.infer<typeof ComputerInfoSchema>;

const KeyLoginListSchema = z.array(KeyLoginSchema);

type KeyLoginList = z.infer<typeof KeyLoginListSchema>;

export { KeyLoginSchema, KeyLoginListSchema, ComputerInfoSchema };

export type { KeyLogin, KeyLoginList, ComputerInfo };
