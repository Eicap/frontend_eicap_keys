import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export type SigninInput = z.infer<typeof signinSchema>;
