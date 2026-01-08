// fetch wrapper that injects auth header
//HTTP helper that injects Firebase ID token
import { auth } from "../firebase";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken();
}

export async function apiFetch(path: string, init?: RequestInit) {
  const token = await getIdToken();

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  // Basic error handling (MVP)
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }

  // Some endpoints may return empty; for ours they return JSON
  return res.json();
}
