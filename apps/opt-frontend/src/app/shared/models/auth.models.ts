export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: UserInfo;
  message?: string;
}

export interface RegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: string;
}

export interface RegisterResponse {
  message: string;
  user?: UserInfo;
}

export interface UserInfo {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  provider?: string; // 'LOCAL', 'GOOGLE', 'GITHUB', etc.
  providerId?: string; // ID spécifique au fournisseur OAuth
}

export interface OAuthRedirectInfo {
  token?: string;
  error?: string;
}

// Pour gérer le contexte d'authentification dans l'application
export interface AuthContextState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}