export function normalizeGameName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}
