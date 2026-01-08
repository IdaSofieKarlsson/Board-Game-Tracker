import { apiFetch } from "./http";

export type SessionResult = "WIN" | "TIE" | "LOSS";

export async function createSession(payload: {
  gameId: string;
  result: SessionResult;
  playedAt?: string; // ISO
}) {
  return apiFetch("/api/sessions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
