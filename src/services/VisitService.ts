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