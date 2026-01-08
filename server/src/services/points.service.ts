export function pointsFromResult(result: "WIN" | "TIE" | "LOSS"): number {
  if (result === "WIN") return 2;
  if (result === "TIE") return 1;
  return 0;
}
