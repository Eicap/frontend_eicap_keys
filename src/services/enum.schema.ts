import z from 'zod';

const StatusEnumSchema = z.enum([
    'PENDING', 
    'ACTIVE', 
    'APPROVED',
    'INACTIVE',
    'EXPIRED',
]);

type StatusEnum = z.infer<typeof StatusEnumSchema>;

export {
    StatusEnumSchema,
}

export type {
    StatusEnum,
}