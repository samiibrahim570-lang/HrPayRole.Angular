export interface User {
  userId: number;
  roleId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  contactNumber?: string;
  whatsAppNumber?: string;
  phoneNumber?: string;
  image?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthRequest {
  email?: string;
  password?: string;
  contactNumber?: string;
}