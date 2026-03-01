// src/services/userService.ts
import { http } from '../lib/api';

export type UserRole = 'SHELTER' | 'USER';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Ajuste o shape conforme seu backend retornar (id, token, etc.)
export interface CreateUserResponse {
  id?: string | number;
  name?: string;
  email?: string;
  role?: UserRole;
}

export async function createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
  return http<CreateUserResponse>('/users', {
    method: 'POST',
    body: payload,
  });
}