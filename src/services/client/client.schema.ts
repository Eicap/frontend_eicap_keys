import z from "zod";

const ClienSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    createdAt: z.date(),
});

type Client = z.infer<typeof ClienSchema>;

const ClientListSchema = z.array(ClienSchema);

type ClientList = z.infer<typeof ClientListSchema>;

const CreateClientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string(),
})

type CreateClient = z.infer<typeof CreateClientSchema>;

const UpdateClientSchema = CreateClientSchema.partial();

type UpdateClient = z.infer<typeof UpdateClientSchema>;

export {
    ClienSchema,
    ClientListSchema,
    CreateClientSchema,
    UpdateClientSchema,
}

export type {
    Client,
    ClientList,
    CreateClient,
    UpdateClient,
}