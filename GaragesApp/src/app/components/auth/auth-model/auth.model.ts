// export interface DecodedToken {
//   username: string;
//   email: string;
//   avatarUrl: string | null;
//   role: string;
//   exp: number;
// }

export interface DecodedToken {
  // usando aliases para facilitar
  [key: string]: any; // fallback

  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
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