export interface DecodedToken {
  username: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  exp: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}