import { useEffect, useState } from "react";
import { getMe, patchMe, type Me } from "../api/me";
import { getOverviewStats, type OverviewStats } from "../api/stats";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";


export default function Overview() {
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<OverviewStats | null>(null);

  const [username, setUsername] = useState("");
  const [funFact, setFunFact] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function logout() {
    await signOut(auth);
    navigate("/");
  }


  async function load() {
    setError(null);
    setLoading(true);
    try {
      const [meData, statsData] = await Promise.all([getMe(), getOverviewStats()]);
      setMe(meData);
      setStats(statsData);

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

  return (
    <div style={{ padding: 16 }}>
      <h1>Overview</h1>
      <button onClick={logout}>Logout</button>
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
        <p>
          Favorite game id:{" "}
          <strong>{stats.favoriteGameId ?? "None yet"}</strong>
        </p>
      </section>
    </div>
  );
}
