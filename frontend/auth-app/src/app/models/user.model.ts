export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  last_login?: string;
  google_id?: string;
  profile_picture?: string;
  auth_provider?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface UserStatusUpdate {
  is_active: boolean;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
}

export interface Token {
  access_token: string;
  token_type: string;
}
