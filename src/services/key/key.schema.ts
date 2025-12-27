import z from 'zod';
import { StatusEnumSchema } from '../enum.schema';
import { PermissionSchema } from '../permission/permission.schema';

const ClientInfoShcema = z.object({
    id: z.uuid(),
    name : z.string(),
    email: z.email(),
})

const KeyTypeSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().optional(),
    permissions: z.array(PermissionSchema),
})

const KeySchema = z.object({
    id: z.uuid(),
    code: z.string().min(1).max(100),
    due_date: z.string().optional(),
    init_date: z.string().optional(),
    batch_id: z.uuid().optional(),

    state: StatusEnumSchema,
    client: ClientInfoShcema.optional(),
    key_type: KeyTypeSchema,

    created_at: z.string(),
    updated_at: z.string(),
})

type Key = z.infer<typeof KeySchema>;

const KeyListSchema = z.array(KeySchema);

type KeyList = z.infer<typeof KeyListSchema>;

const KeyUpdateSchema = z.object({
    code: z.string().min(1).max(100).optional(),
    due_date: z.date().optional().nullable(),
    init_date: z.date().optional().nullable(),
    state: StatusEnumSchema.optional(),
    key_type_id: z.uuid().optional(),
    client_id: z.uuid().optional().nullable(),
})

type KeyUpdate = z.infer<typeof KeyUpdateSchema>;

export {
    KeySchema,
    KeyListSchema,
    KeyUpdateSchema,
}

export type {
    Key,
    KeyList,
    KeyUpdate,
}