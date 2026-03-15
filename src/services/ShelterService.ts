// src/services/userService.ts
import { http } from '../lib/api';

export type UserRole = 'SHELTER' | 'USER';

export interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
}

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

export function getAllShelters() {
  return http<Shelter[]>('/shelters', { auth: false });
}

export function getShelterById(id: number) {
  return http<Shelter>(`/shelters/${id}`, { auth: false });
}

export function getMyShelter() {
  return http<Shelter>(`/shelters/me`);
}

export function updateShelter(id: number, data: Partial<Shelter>) {
  return http<{ message: string }>(`/shelters/${id}`, { method: 'PUT', body: data });
}

export function deleteShelter(id: number) {
  return http<{ message: string }>(`/shelters/${id}`, { method: 'DELETE' });
}