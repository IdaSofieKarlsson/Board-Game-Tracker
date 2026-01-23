import { useEffect, useMemo, useState } from "react";
import { getMe, patchMe, type Me } from "../api/me";
import { getOverviewStats, type OverviewStats } from "../api/stats";
import { getGames, type Game } from "../api/games";

export default function Overview() {
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  const [username, setUsername] = useState("");
  const [funFact, setFunFact] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const [meData, statsData, gamesData] = await Promise.all([
        getMe(),
        getOverviewStats(),
        getGames()
      ]);

      setMe(meData);
      setStats(statsData);
      setGames(gamesData);

      setUsername(meData.username ?? "");
      setFunFact(meData.funFact ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Kunde inte ladda översikt.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const displayName = useMemo(() => {
    if (!me) return "";
    return me.username?.trim() ? me.username : me.email;
  }, [me]);

  const favoriteGameName = useMemo(() => {
    if (!stats?.favoriteGameId) return "Inget ännu";
    return games.find((g) => g._id === stats.favoriteGameId)?.name ?? "Okänt spel";
  }, [stats, games]);

  async function saveProfile() {
    setError(null);
    setSaving(true);
    try {
      const updated = await patchMe({
        username: username.trim() ? username.trim() : undefined,
        funFact: funFact.trim() ? funFact.trim() : undefined
      });
      setMe(updated);
    } catch (e: any) {
      setError(e?.message ?? "Kunde inte spara profil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Laddar…</p>;
  if (error) return <p>{error}</p>;
  if (!me || !stats) return <p>Data saknas.</p>;

  return (
    <div className="main-inner">
      <h1 className="h1">Översikt</h1>

      <div className="two-col">
        {/* Profile */}
        <section className="panel">
          <h2 className="panel-title">Din profil</h2>

          <div className="stats-grid" style={{ marginBottom: 10 }}>
            <div className="stat-row">
              <span>Inloggad som</span>
              <strong>{displayName}</strong>
            </div>
          </div>

          <div className="form-grid">
            <label>
              <span className="label">Välj nytt användarnamn</span>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Valfritt (annars används e-post)"
              />
            </label>

            <label>
              <span className="label">Skriv något om dig!</span>
              <textarea
                className="textarea"
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
                placeholder="Skriv något kul (max 500 tecken)"
              />
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? "Sparar…" : "Spara"}
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="panel">
          <h2 className="panel-title">Statistik</h2>

          <div className="stats-grid">
            <div className="stat-row">
              <span>Du spelar oftast: </span>
              <strong>{favoriteGameName}</strong>
            </div>

            <div className="stat-row">
              <span>Total poäng</span>
              <strong>{stats.totalPoints}</strong>
            </div>
          </div>

          <p style={{ marginTop: 12, fontSize: 12, opacity: 0.95 }}>
            Poäng: vinst = 2, oavgjort = 1, förlust = 0.
          </p>
        </section>
      </div>
    </div>
  );
}
