// src/lib/api.ts
const rawBaseUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!rawBaseUrl) {
  throw new Error('VITE_API_URL não está configurada no .env');
}

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function parseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  return text || null;
}

function getTokenSafe(): string | null {
  // evita circular import com authService
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export async function http<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    auth?: boolean; // default true
  } = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const token = auth ? getTokenSafe() : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseBody(res);

  if (!res.ok) {
    const message =
      (typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof (payload as any).message === 'string')
        ? (payload as any).message
        : typeof payload === 'string' && payload
          ? payload
          : 'Erro na requisição.';

    throw new ApiError(message, res.status, payload);
  }

  return payload as T;
}