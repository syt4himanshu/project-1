

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiResponse<T = any> = {
  status: number;
  body: T;
};

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:5002';

export let adminToken = '';

export async function request<T = any>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  token?: string,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: any = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = { raw: text };
  }

  return {
    status: res.status,
    body: parsed,
  };
}

export async function loginAdmin(): Promise<string> {
  const uid = process.env.TEST_ADMIN_UID || 'admin';
  const password = process.env.TEST_ADMIN_PASSWORD || 'adminpass123';

  const res = await request<{ access_token?: string }>('POST', '/api/auth/login', {
    username: uid,
    password,
  });

  if (res.status !== 200 || !res.body?.access_token) {
    throw new Error(
      `Failed admin login in test setup: status=${res.status}, body=${JSON.stringify(res.body)}`,
    );
  }

  adminToken = res.body.access_token;
  return adminToken;
}



export default async function globalSetup() {
  // Keep global setup lightweight; per-suite login still runs via beforeAll above.
}
