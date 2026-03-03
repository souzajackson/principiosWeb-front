// src/services/authService.ts

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

export interface AuthUser {
  id: number;
  role: 'USER' | 'SHELTER' | 'SUPER';
}

// ─── Token ────────────────────────────────────────────────────────────────────

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// ─── User cache ───────────────────────────────────────────────────────────────

export function saveUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSavedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ─── Decode JWT payload (client-side, sem verificar assinatura) ───────────────
// Serve para extrair id e role do token sem precisar de uma rota /me extra.

export function decodeTokenPayload(token: string): AuthUser | null {
  try {
    const base64 = token.split('.')[1];
    const json   = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    // Adapte os campos caso generateToken() use nomes diferentes (sub, userId…)
    return {
      id:   payload.id   ?? payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}