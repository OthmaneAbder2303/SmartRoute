export interface RegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  userId?: string;
}
