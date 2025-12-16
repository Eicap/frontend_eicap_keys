export interface SigninDto {
  email: string;
  password: string;
}

// Auth Response Types
export interface AuthResponse {
  //   user: JobSeekerResponse | CompanyResponse;
  token: string;
}
// JWT Payload Types
export interface JWTPayload {
  user_id?: string;
  sub?: string;
  email: string;
  name?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

// Axios Error Type
export interface AxiosErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status?: "active" | "inactive";
}

export interface ClientCreateInput {
  name: string;
  email: string;
  phone: string;
}

export interface ClientUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClientListResponse {
  data: Client[];
  total: number;
  limit: number;
  offset: number;
  pages: number;
}
