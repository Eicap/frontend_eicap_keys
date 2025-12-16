import axiosInstance from "@/lib/axios";
import type { SigninInput } from "@/schemas/auth.schema";

import type { AuthResponse } from "./types/responses";

export const authService = {
  signin: (data: SigninInput) => axiosInstance.post<AuthResponse>("/auth/login", data),
};
