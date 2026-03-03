// src/services/userService.ts
import { http } from '../lib/api';

export type UserRole = 'SHELTER' | 'USER';

export interface CreateShelterRequest {
  name: string;
  phone: string;
  address: string;
}

// Ajuste o shape conforme seu backend retornar (id, token, etc.)
export interface CreateShelterResponse {
  id?: string | number;
  name?: string;
  address?: string;
  phone?: UserRole;
  userId?: string | number;
}

export async function createShelter(payload: CreateShelterRequest): Promise<CreateShelterResponse> {
  return http<CreateShelterResponse>('/shelters', {
    method: 'POST',
    body: payload,
  });
}
