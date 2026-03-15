import { http } from "@/lib/api";
import { Animal } from "./AnimalService";
import { AdoptionStatus } from "./enums";

export interface Adoption {
  id: number;
  userId: number;
  animalId: number;
  status: AdoptionStatus;
  date?: string;       // ← era createdAt
  animal?: Animal;
}


export function getAdoptionById(id: number) {
  return http<Adoption>(`/adoptions/${id}`);
}

export function createAdoption(data: { animalId: number }) {
  return http<Adoption>('/adoptions', { method: 'POST', body: data });
}

export function approveAdoption(id: number) {
  return http<{ message: string }>(`/adoptions/${id}/approve`, { method: 'PATCH' });
}

export function rejectAdoption(id: number) {
  return http<{ message: string }>(`/adoptions/${id}/reject`, { method: 'PATCH' });
}

export function deleteAdoption(id: number) {
  return http<{ message: string }>(`/adoptions/${id}`, { method: 'DELETE' });
}

// Retorna as adoções feitas pelo usuário logado
export function getMyAdoptions() {
  return http<Adoption[]>('/adoptions/my');
}

// Retorna as solicitações dos animais do abrigo logado
export function getMyShelterAdoptions() {
  return http<Adoption[]>('/adoptions/shelter');
}