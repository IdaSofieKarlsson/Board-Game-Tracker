import { useEffect, useMemo, useState } from "react";
import { getGames, type Game, createGameWithDuplicateHandling } from "../api/games";
import { createSession, type SessionResult } from "../api/sessions";
import { Modal } from "../components/Modal";

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

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const list = await getGames();
      setGames(list);
    } catch (e: any) {
      setError(e?.message ?? "Kunde inte ladda spel.");
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
    setPlayedDate(today);
    setSessionOpen(true);
  }

  async function submitAddGame() {
    setError(null);
    try {
      const trimmed = newName.trim();
      if (!trimmed) return;

      const res = await createGameWithDuplicateHandling({ name: trimmed, category: newCategory });

      if (res.kind === "duplicate") {
        setDupGame(res.game);
        setDupConfirmOpen(true);
        return;
      }

      setAddOpen(false);
      setNewName("");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Kunde inte lägga till spel.");
    }
  }

  async function confirmDuplicateYes() {
    if (!dupGame) return;
    setDupConfirmOpen(false);
    setAddOpen(false);
    setNewName("");

    openSessionForGameId(dupGame.id);
    setDupGame(null);
  }

  function confirmDuplicateNo() {
    setDupConfirmOpen(false);
    setDupGame(null);
  }

  async function submitSession() {
    setError(null);
    try {
      if (!selectedGameId) return;

      // prevent future dates (client UX)
      if (playedDate > today) {
        setError("Datum kan inte vara i framtiden.");
        return;
      }

      const playedAtIso = new Date(`${playedDate}T12:00:00`).toISOString();

      await createSession({
        gameId: selectedGameId,
        result,
        playedAt: playedAtIso
      });

      setSessionOpen(false);
      setSelectedGameId(null);
    } catch (e: any) {
      setError(e?.message ?? "Kunde inte registrera spelomgång.");
    }
  }

  if (loading) return <p>Laddar…</p>;

  return (
    <div className="main-inner">
      <h1 className="h1">Spel</h1>

      {error && (
        <div className="panel" style={{ background: "rgba(255,255,255,0.45)" }}>
          <strong>Fel:</strong> {error}
        </div>
      )}

      {/* Games list */}
      <section className="panel">
        <h2 className="panel-title">Välj ett spel för att registrera en spelomgång</h2>

        <div className="game-list">
          {games.map((g) => (
            <div key={g._id} className="game-card">
              <div>
                <div className="game-name">{g.name}</div>
                <div className="game-meta">{g.category}</div>
              </div>

              <button className="btn btn-primary" onClick={() => openSessionForGameId(g._id)}>
                Registrera spelomgång
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Add game prompt */}
      <section className="panel">
        <h2 className="panel-title">Saknas ditt favoritspel?</h2>
        <p style={{ marginTop: 0 }}>Lägg till det här!</p>
        <button className="btn" onClick={() => setAddOpen(true)}>
          Lägg till nytt spel
        </button>
      </section>

      {/* Add Game Modal */}
      <Modal title="Lägg till nytt spel" open={addOpen} onClose={() => setAddOpen(false)}>
        <p className="modal-subtitle">Fyll i namn och kategori och spara.</p>

        <div className="form-grid">
          <label>
            <span className="label">Spelnamn</span>
            <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </label>

          <label>
            <span className="label">Kategori</span>
            <select
              className="select"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Game["category"])}
            >
              <option value="BRADSPEL">Brädspel</option>
              <option value="KORTSPEL">Kortspel</option>
              <option value="ANNAT">Annat</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="btn" onClick={() => setAddOpen(false)}>
              Avbryt
            </button>
            <button className="btn btn-primary" onClick={submitAddGame}>
              Spara
            </button>
          </div>
        </div>
      </Modal>

      {/* Duplicate confirmation modal */}
      <Modal title="Menade du detta spel?" open={dupConfirmOpen} onClose={confirmDuplicateNo}>
        {dupGame ? (
          <div className="form-grid">
            <p className="modal-subtitle">
              Ett spel med samma namn finns redan: <strong>{dupGame.name}</strong> ({dupGame.category})
            </p>

            <div className="form-actions">
              <button className="btn" onClick={confirmDuplicateNo}>
                Nej
              </button>
              <button className="btn btn-primary" onClick={confirmDuplicateYes}>
                Ja
              </button>
            </div>
          </div>
        ) : (
          <p>Inget att visa.</p>
        )}
      </Modal>

      {/* Register session modal */}
      <Modal
        title={selectedGame ? `Registrera spelomgång: ${selectedGame.name}` : "Registrera spelomgång"}
        open={sessionOpen}
        onClose={() => setSessionOpen(false)}
      >
        <p className="modal-subtitle">
          Välj resultat och datum. Datum kan inte vara i framtiden.
        </p>

        <div className="form-grid">
          <label>
            <span className="label">Resultat</span>
            <select className="select" value={result} onChange={(e) => setResult(e.target.value as SessionResult)}>
              <option value="WIN">Vinst (2p)</option>
              <option value="TIE">Oavgjort (1p)</option>
              <option value="LOSS">Förlust (0p)</option>
            </select>
          </label>

          <label>
            <span className="label">Datum</span>
            <input
              className="input"
              type="date"
              value={playedDate}
              max={today}
              onChange={(e) => setPlayedDate(e.target.value)}
            />
          </label>

          <div className="form-actions">
            <button className="btn" onClick={() => setSessionOpen(false)}>
              Avbryt
            </button>
            <button className="btn btn-primary" onClick={submitSession}>
              Spara spelomgång
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
