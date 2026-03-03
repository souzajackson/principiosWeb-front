// src/services/apiService.ts
// Funções tipadas para cada recurso do backend.
// Usa o http() helper já existente em src/lib/api.ts

import { http } from '../lib/api';

const TOKEN_KEY = 'auth_token';

// ─── Tipos espelhando o banco ─────────────────────────────────────────────────

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'SHELTER' | 'SUPER';
}

export interface Shelter {
  id: number;
  name: string;
  address: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  description?: string;
  workingHours?: string;
  foundedYear?: number;
}

export interface Animal {
  id: number;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  gender?: string;
  size?: string;
  weight?: string;
  color?: string;
  image?: string;
  shelterId: number;
  shelter?: string;
  location?: string;
  personality?: string;
  healthStatus?: string;
  description?: string;
}

export interface Visit {
  id: number;
  userId: number;
  shelterId: number;
  date: string;
  time?: string;
  status?: string;
  shelter?: Shelter;
}

export interface Adoption {
  id: number;
  userId: number;
  animalId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  animal?: Animal;
  user?: UserProfile;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  message: string;
  token: string;
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export async function login(email: string, password: string) {

  const res = await http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });

  // salva token automaticamente
  setAuthToken(res.token);
  return res;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function createUser(data: { name: string; email: string; password: string; role?: string }) {
  return http<UserProfile>('/users', {
    method: 'POST',
    body: data,
    auth: false,
  });
}

export function getUserById(id: number) {
  return http<UserProfile>(`/users/${id}`);
}

export function updateUser(id: number, data: Partial<UserProfile>) {
  return http<{ message: string }>(`/users/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function deleteUser(id: number) {
  return http<{ message: string }>(`/users/${id}`, { method: 'DELETE' });
}

// ─── Shelters ─────────────────────────────────────────────────────────────────

export function getAllShelters() {
  return http<Shelter[]>('/shelters', { auth: false });
}

export function getShelterById(id: number) {
  return http<Shelter>(`/shelters/${id}`, { auth: false });
}

export function createShelter(data: Partial<Shelter>) {
  return http<Shelter>('/shelters', { method: 'POST', body: data });
}

export function updateShelter(id: number, data: Partial<Shelter>) {
  return http<{ message: string }>(`/shelters/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function deleteShelter(id: number) {
  return http<{ message: string }>(`/shelters/${id}`, { method: 'DELETE' });
}

// ─── Animals ──────────────────────────────────────────────────────────────────

export function getAllAnimals() {
  return http<Animal[]>('/animals', { auth: false });
}

export function searchAnimals(params: {
  name?: string;
  species?: string;
  breed?: string;
  size?: string;
  gender?: string;
}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
  ).toString();
  return http<Animal[]>(`/animals/search${query ? `?${query}` : ''}`, { auth: false });
}

export function getAnimalById(id: number) {
  return http<Animal>(`/animals/${id}`, { auth: false });
}

export function createAnimal(data: Omit<Animal, 'id'>) {
  return http<Animal>('/animals', { method: 'POST', body: data });
}

export function updateAnimal(id: number, data: Partial<Animal>) {
  return http<{ message: string }>(`/animals/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function deleteAnimal(id: number) {
  return http<{ message: string }>(`/animals/${id}`, { method: 'DELETE' });
}

// ─── Visits ───────────────────────────────────────────────────────────────────

export function getAllVisits() {
  return http<Visit[]>('/visits');
}

export function getVisitById(id: number) {
  return http<Visit>(`/visits/${id}`);
}

export function createVisit(data: { shelterId: number; date: string; time?: string }) {
  return http<Visit>('/visits', { method: 'POST', body: data });
}

export function deleteVisit(id: number) {
  return http<{ message: string }>(`/visits/${id}`, { method: 'DELETE' });
}

// ─── Adoptions ────────────────────────────────────────────────────────────────

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