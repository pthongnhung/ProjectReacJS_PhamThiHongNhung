export interface User {
  id: number | string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
