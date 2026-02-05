import { z } from 'zod';

const ComputerInfoSchema = z.object({
    id: z.uuid(),
    computer_name: z.string(),
    ip: z.string(),
    os: z.string(),
    state: z.string(),
    mac_address: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

type ComputerInfo = z.infer<typeof ComputerInfoSchema>;

const UpdateComputerInfoSchema = ComputerInfoSchema.partial().pick({
    state: true,
});

type UpdateComputerInfo = z.infer<typeof UpdateComputerInfoSchema>;

export {
    ComputerInfoSchema,
    UpdateComputerInfoSchema,
}

export type {
    ComputerInfo,
    UpdateComputerInfo,
}

