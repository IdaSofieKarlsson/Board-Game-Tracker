import { apiFetch } from "./http";

export type Game = {
  _id: string;
  name: string;
  category: "BRADSPEL" | "KORTSPEL" | "ANNAT";
  nameKey: string;
};

type DuplicateGame = { id: string; name: string; category: Game["category"] };

export async function getGames(): Promise<Game[]> {
  return apiFetch("/api/games");
}

// Special: returns either { created } or { duplicate }
export async function createGameWithDuplicateHandling(payload: { name: string; category: Game["category"] })
  : Promise<{ kind: "created"; game: Game } | { kind: "duplicate"; game: DuplicateGame }> {

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { auth } = await import("../firebase");
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken();

  const res = await fetch(`${baseUrl}/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (res.status === 409) {
    const json = await res.json();
    return { kind: "duplicate", game: json.game as DuplicateGame };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }

  const created = (await res.json()) as Game;
  return { kind: "created", game: created };
}
