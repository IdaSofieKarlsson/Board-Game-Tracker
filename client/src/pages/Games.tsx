import { useEffect, useMemo, useState } from "react";
import { getGames, type Game, createGameWithDuplicateHandling } from "../api/games";
import { createSession, type SessionResult } from "../api/sessions";
import { Modal } from "../components/Modal";
import { Link } from "react-router-dom";

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add game modal state
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Game["category"]>("BRADSPEL");

  // Duplicate confirm state
  const [dupConfirmOpen, setDupConfirmOpen] = useState(false);
  const [dupGame, setDupGame] = useState<{ id: string; name: string; category: Game["category"] } | null>(null);

  // Session modal state
  const [sessionOpen, setSessionOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [result, setResult] = useState<SessionResult>("WIN");
  const [playedDate, setPlayedDate] = useState(""); // YYYY-MM-DD

  const selectedGame = useMemo(
    () => games.find((g) => g._id === selectedGameId) ?? null,
    [games, selectedGameId]
  );

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const list = await getGames();
      setGames(list);
    } catch (e) {
      setError("Failed to load games.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openSessionForGameId(gameId: string) {
    setSelectedGameId(gameId);
    setResult("WIN");

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setPlayedDate(today);

    setSessionOpen(true);
    }

  async function submitAddGame() {
    setError(null);
    try {
      const trimmed = newName.trim();
      if (!trimmed) return;

      const res = await createGameWithDuplicateHandling({ name: trimmed, category: newCategory });
        
      // Ask "Do you mean this game?"
      if (res.kind === "duplicate") {
        setDupGame(res.game);
        setDupConfirmOpen(true);
        return;
        }

      // Created successfully
      setAddOpen(false);
      setNewName("");
      await load();
    } catch (e) {
      setError("Failed to add game.");
    }
  }

  async function confirmDuplicateYes() {
    if (!dupGame) return;
    setDupConfirmOpen(false);
    setAddOpen(false);
    setNewName("");

    // Open session modal for existing game
    openSessionForGameId(dupGame.id);
    setDupGame(null);
  }

  function confirmDuplicateNo() {
    // Keep add modal open; user can change the name
    setDupConfirmOpen(false);
    setDupGame(null);
  }

  async function submitSession() {
    const playedAtIso = new Date(`${playedDate}T12:00:00`).toISOString();
    setError(null);
    try {
      if (!selectedGameId) return;

      await createSession({
        gameId: selectedGameId,
        result,
        playedAt: playedAtIso
      });

      setSessionOpen(false);
      setSelectedGameId(null);
    } catch (e) {
      setError("Failed to register session.");
    }
  }

  if (loading) return <p>Loading games...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Games</h1>
      {error && <p>{error}</p>}

      <button onClick={() => setAddOpen(true)}>Add Game</button>

      <ul>
        {games.map((g) => (
          <li key={g._id} style={{ marginTop: 8 }}>
            <button onClick={() => openSessionForGameId(g._id)}>
              {g.name} ({g.category})
            </button>
          </li>
        ))}
      </ul>

      {/* Add Game Modal */}
      <Modal title="Add game" open={addOpen} onClose={() => setAddOpen(false)}>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            Name
            <input value={newName} onChange={(e) => setNewName(e.target.value)} />
          </label>

          <label>
            Category
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Game["category"])}>
              <option value="BRADSPEL">Brädspel</option>
              <option value="KORTSPEL">Kortspel</option>
              <option value="ANNAT">Annat</option>
            </select>
          </label>

          <button onClick={submitAddGame}>Save</button>
        </div>
      </Modal>

      {/* Duplicate confirmation modal */}
      <Modal title="Do you mean this game?" open={dupConfirmOpen} onClose={confirmDuplicateNo}>
        {dupGame ? (
          <div style={{ display: "grid", gap: 12 }}>
            <p>
              Existing game found: <strong>{dupGame.name}</strong> ({dupGame.category})
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={confirmDuplicateYes}>Yes</button>
              <button onClick={confirmDuplicateNo}>No</button>
            </div>
          </div>
        ) : (
          <p>No match.</p>
        )}
      </Modal>

      {/* Register session modal */}
      <Modal
        title={selectedGame ? `Register session: ${selectedGame.name}` : "Register session"}
        open={sessionOpen}
        onClose={() => setSessionOpen(false)}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            Result
            <select value={result} onChange={(e) => setResult(e.target.value as SessionResult)}>
              <option value="WIN">Win (2p)</option>
              <option value="TIE">Tie (1p)</option>
              <option value="LOSS">Loss (0p)</option>
            </select>
          </label>
          <label>
            Date (YYYY-MM-DD)
            <input
                type="date"
                value={playedDate}
                max={new Date().toISOString().slice(0, 10)} // prevents future
                onChange={(e) => setPlayedDate(e.target.value)}
            />
            </label>
          <button onClick={submitSession}>Save session</button>
        </div>
      </Modal>
    </div>
  );
}
