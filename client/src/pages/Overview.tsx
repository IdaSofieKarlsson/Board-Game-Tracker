import { useEffect, useState } from "react";
import { getMe, patchMe, type Me } from "../api/me";
import { getOverviewStats, type OverviewStats } from "../api/stats";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getGames, type Game } from "../api/games";


export default function Overview() {
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<OverviewStats | null>(null);

  const [username, setUsername] = useState("");
  const [funFact, setFunFact] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  const navigate = useNavigate();

  async function logout() {
    await signOut(auth);
    navigate("/");
  }


  async function load() {
    setError(null);
    setLoading(true);
    try {
      const [meData, statsData, gamesData] = await Promise.all([getMe(), getOverviewStats(), getGames()]);
      setMe(meData);
      setStats(statsData);
      setGames(gamesData);

      setUsername(meData.username ?? "");
      setFunFact(meData.funFact ?? "");
    } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Failed to load overview data.");
        } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile() {
    setError(null);
    setSaving(true);
    try {
      const updated = await patchMe({
        username: username.trim() ? username.trim() : undefined,
        funFact: funFact.trim() ? funFact.trim() : undefined
      });
      setMe(updated);
    } catch (e) {
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading overview...</p>;
  if (error) return <p>{error}</p>;
  if (!me || !stats) return <p>Missing data.</p>;

  const displayName = me.username?.trim() ? me.username : me.email;

  const favoriteGameName =
    stats.favoriteGameId
      ? games.find((g) => g._id === stats.favoriteGameId)?.name ?? "Unknown"
      : "None yet";

  return (
    <div style={{ padding: 16 }}>
      <h1>Overview</h1>
      <section style={{ marginBottom: 16 }}>
        <h2>User</h2>
        <p>
          Signed in as: <strong>{displayName}</strong>
        </p>

        <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Optional username"
            />
          </label>

          <label>
            Fun fact
            <textarea
              value={funFact}
              onChange={(e) => setFunFact(e.target.value)}
              placeholder="Optional fun fact"
              rows={4}
            />
          </label>

          <button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </section>

      <section>
        <h2>Stats</h2>
        <p>Total points: <strong>{stats.totalPoints}</strong></p>
        <p>Favorite game: <strong>{favoriteGameName}</strong></p>
      </section>
    </div>
  );
}
