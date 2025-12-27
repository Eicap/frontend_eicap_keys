import api from "@/lib/axios";
import type { SigninInput } from "@/schemas/auth.schema";

import type { AuthResponse } from "./types/responses";

export const authService = {
  signin: (data: SigninInput) => api.post<AuthResponse>("/auth/login", data),
};
