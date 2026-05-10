const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getAdminToken(): string | null {
  return sessionStorage.getItem("admin_token");
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem("admin_token", token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem("admin_token");
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${BASE}/api${path}`, { ...options, headers });
}
