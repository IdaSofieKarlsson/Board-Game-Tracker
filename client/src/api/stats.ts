import { apiFetch } from "./http";

export type OverviewStats = {
  totalPoints: number;
  favoriteGameId: string | null;
};

export async function getOverviewStats(): Promise<OverviewStats> {
  return apiFetch("/api/stats/overview");
}
