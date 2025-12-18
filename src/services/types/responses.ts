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

// KeyType Types
export interface KeyType {
  id: string;
  name: string;
  description?: string;
}

export interface KeyTypeListResponse {
  data: {
    data: KeyType[];
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

//Permissions
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface PermissionListResponse {
  data: Permission[];
}

// Keys
export interface Key {
  id: string;
  code: string;
  due_date: string;
  init_date: string;
  state: "active" | "inactive";
  user_id: string;
  user_name: string;
  client_id: string;
  client_name: string;
  key_type: KeyType;
  permissions: Permission[];
  created_at: string;
}

export interface KeyCreateInput {
  code: string;
  due_date: string;
  init_date: string;
  client_id?: string;
  status?: "active" | "inactive";
  key_type_id: string;
  permissions?: string[];
}

export interface KeyUpdateInput {
  code?: string;
  due_date?: string;
  init_date?: string;
  client_id?: string;
  status?: "active" | "inactive";
  key_type_id?: string;
  permissions?: string[];
}

export interface KeyListResponse {
  data: Key[];
  total: number;
  limit: number;
  offset: number;
  pages: number;
}

export interface KeyResponse {
  id: string;
  code: string;
  due_date: string;
  init_date: string;
  state?: "active" | "inactive";
  client_id: string;
  client_name: string;
  key_type: KeyType;
  permissions: Permission[];
  created_at: string;
}

export interface GenerateCodeResponse {
  code: string;
}

export interface GenerateKeysInput {
  quantity: number;
}
