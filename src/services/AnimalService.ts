import { http } from "@/lib/api";

export interface Animal {
  id: number;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  gender?: string;
  size?: string;
  photoUrl?: string;
  description?: string;
  personality?: string;
  healthStatus?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  shelterName?: string;
  shelterPhone?: string;
  shelterEmail?: string;
  weight?: string;
  color?: string;
  shelterId: number;
  location?: string;
}

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
  return http<{ message: string }>(`/animals/${id}`, { method: 'PUT', body: data });
}

export function deleteAnimal(id: number) {
  return http<{ message: string }>(`/animals/${id}`, { method: 'DELETE' });
}
