// src/services/userService.ts
import { http } from '../lib/api';
import { UserRole } from './enums';


export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  shelterData?: {
    id: number,
    name: string;
    address: string;
    phone: string;
  };
}

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

export function getUserById(id: number) {
  return http<UserProfile>(`/users/${id}`);
}

export function updateUser(id: number, data: Partial<UserProfile>) {
  return http<{ message: string }>(`/users/${id}`, { method: 'PUT', body: data });
}

export function deleteUser(id: number) {
  return http<{ message: string }>(`/users/${id}`, { method: 'DELETE' });
}