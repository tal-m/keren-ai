function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as unknown as string | undefined) ?? '';
  const v = String(raw).trim();

  // Fail fast for missing values and common misconfig placeholders.
  if (!v || v === 'undefined' || v === 'null' || v.includes('{') || v.includes('}') || v.includes('$')) {
    throw new Error(
      'Missing/invalid VITE_API_BASE_URL. Set it at build time (Docker build arg) so the frontend can reach the API gateway.'
    );
  }

  // Normalize: remove trailing slashes.
  return v.replace(/\/+$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

// Debug: verify what the bundle thinks the value is at runtime
console.log("[api.ts] VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
console.log("[api.ts] API_BASE_URL =", API_BASE_URL);
;(window as any).__API_BASE_URL__ = API_BASE_URL;

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error: ${res.status}${text ? ` - ${text}` : ''}`);
  }
  return res.json();
}

export async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error: ${res.status}${text ? ` - ${text}` : ''}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  // Some endpoints return empty or text bodies.
  return res.text();
}
