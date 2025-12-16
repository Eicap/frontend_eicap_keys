import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { signinSchema, type SigninInput } from "@/schemas/auth.schema";
import type { JWTPayload, AxiosErrorResponse } from "@/services/types/responses";

// Helper para decodificar JWT
function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export const useSignin = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setError, setLoading } = useAuthStore();

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: SigninInput) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.signin(data);
        const { token } = response.data;

        // Guardar token en localStorage
        localStorage.setItem("auth-token", token);
        setToken(token);

        // Decodificar JWT para obtener info del usuario
        const decoded = decodeToken(token);
        if (decoded) {
          setUser({
            id: decoded.user_id || decoded.sub || "",
            email: decoded.email || data.email,
            name: decoded.name || "User",
            role: decoded.role || "user",
          });
        }

        // Redirigir al componente ClientForm
        navigate("/client/dashboard");
      } catch (error: unknown) {
        const axiosError = error as AxiosErrorResponse;
        const errorMessage = axiosError.response?.data?.error || "Error en la sesión";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken, setError, setLoading, navigate]
  );

  return { form, onSubmit };
};

// Hook para usar el store directamente
export const useAuth = () => {
  const store = useAuthStore();
  return store;
};
