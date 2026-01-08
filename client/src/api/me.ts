import { apiFetch } from "./http";

export type Me = {
  email: string;
  username: string | null;
  funFact: string | null;
};

export async function getMe(): Promise<Me> {
  return apiFetch("/api/me");
}

export async function patchMe(payload: { username?: string; funFact?: string }): Promise<Me> {
  return apiFetch("/api/me", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
