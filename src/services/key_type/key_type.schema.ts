import z from 'zod';

const PermissionInfoSchema = z.object({
    id: z.uuid(),
    name: z.string(),
});

const KeyTypeSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string(),
    permissions: z.array(PermissionInfoSchema),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
});

type KeyType = z.infer<typeof KeyTypeSchema>;

const CreateKeyTypeSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().max(255, 'La descripción no puede exceder 255 caracteres').optional(),
    permission_ids: z.array(z.uuid())
});

type CreateKeyType = z.infer<typeof CreateKeyTypeSchema>;

const UpdateKeyTypeSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().max(255, 'La descripción no puede exceder 255 caracteres').optional(),
});

type UpdateKeyType = z.infer<typeof UpdateKeyTypeSchema>;

const UpdatePermissionsKeyTypeSchema = z.object({
    create: z.array(z.uuid()).optional(),
    delete: z.array(z.uuid()).optional(),
});

type UpdatePermissionsKeyType = z.infer<typeof UpdatePermissionsKeyTypeSchema>;

export {
    KeyTypeSchema,
    CreateKeyTypeSchema,
    UpdateKeyTypeSchema,
    UpdatePermissionsKeyTypeSchema,
}

export type {
    KeyType,
    CreateKeyType,
    UpdateKeyType,
    UpdatePermissionsKeyType,
};