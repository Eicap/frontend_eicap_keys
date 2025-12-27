import z from 'zod';

const PermissionSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    code: z.string(),
    description: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
})

type Permission = z.infer<typeof PermissionSchema>;

export {
    PermissionSchema,
}

export type {
    Permission,
}