import { z } from 'zod';

const LoginSchema = z.object({
    email: z.email({ message: "El email no es válido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type Login = z.infer<typeof LoginSchema>;

const UserSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.string(),
})

type User = z.infer<typeof UserSchema>;

const CreateUserSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    email: z.email({ message: "El email no es válido" }),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirm_password: z.string().min(6, { message: "La confirmación de contraseña es requerida" }),
    role: z.string().min(1, { message: "El rol es requerido" }),
}).refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
});

type CreateUser = z.infer<typeof CreateUserSchema>;

const UpdateUserSchema = CreateUserSchema.partial().refine((data) => {
    if (data.password && data.confirm_password) {
        return data.password === data.confirm_password;
    }
    return true;
}, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
});

type UpdateUser = z.infer<typeof UpdateUserSchema>;

const UpdateUserProfileSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    email: z.email().optional(),
});

type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;

const UserListSchema = z.array(UserSchema);

type UserList = z.infer<typeof UserListSchema>;

export {
    LoginSchema,
    UserSchema,
    CreateUserSchema,
    UpdateUserSchema,
    UpdateUserProfileSchema,
    UserListSchema,
}

export type {
    Login,
    User,
    CreateUser,
    UpdateUser,
    UpdateUserProfile,
    UserList,
}