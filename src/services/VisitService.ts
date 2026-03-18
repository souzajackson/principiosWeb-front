import { http } from "@/lib/api";
import { Shelter } from "./ShelterService";

export interface Visit {
  id: number;
  userId: number;
  shelterId: number;
  date: string;
  time?: string;
  status?: string;
  shelter?: Shelter;
}

export interface ShelterVisitResponse {
  id: number;
  visitDate: string;
  visitTime: string;
  requestDate: string;
  status: 'confirmed' | 'cancelled';
  visitor: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null;
}


export function getAllVisits() {
  return http<Visit[]>('/visits');
}

export function getVisitById(id: number) {
  return http<Visit>(`/visits/${id}`);
}

export function createVisit(data: { shelterId: number; date: string }) {
  return http<Visit>('/visits', { method: 'POST', body: data });
}

export function deleteVisit(id: number) {
  return http<{ message: string }>(`/visits/${id}`, { method: 'DELETE' });
}

export function getMyVisits() {
  return http<Visit[]>('/visits/me');
}

export function getMyShelterVisits() {
  return http<ShelterVisitResponse[]>('/visits/me');
}