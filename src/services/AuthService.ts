// src/services/authService.ts
import { http } from '../lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

const TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });

  // salva token automaticamente
  setAuthToken(res.token);
  return res;
}