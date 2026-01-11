import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import KnappenAvatar from "../assets/KnappenAvatarImproved.webp";

export default function Login() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function login() {
    setError(null);
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      navigate("/overview");
    } catch (e: any) {
      setError(e?.code ?? "Inloggning misslyckades");
    } finally {
      setBusy(false);
    }
  }

  async function register() {
    setError(null);
    setBusy(true);
    try {
      await createUserWithEmailAndPassword(auth, registerEmail.trim(), registerPassword);
      navigate("/overview");
    } catch (e: any) {
      setError(e?.code ?? "Registrering misslyckades");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="content-wrap" style={{ padding: "22px 0 32px" }}>
      {/* Knappen image (centered) */}
      <div className="panel" style={{ maxWidth: 520, margin: "0 auto 16px" }}>
        <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
          <img
            src={KnappenAvatar}
            alt="Knappen"
            style={{
              width: 320,
              height: 320,
              borderRadius: 18,
              
              objectFit: "cover"
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div className="h1" style={{ margin: 0 }}>Knappens Brädspels-Portal</div>
            <p style={{ margin: "6px 0 0" }}>
              Registrera spelomgångar och följ din statistik.
            </p>
          </div>
        </div>
      </div>

      {/* Login + Register box (wider, shorter, side-by-side) */}
      <div className="panel" style={{ maxWidth: 860, margin: "0 auto" }}>
        {error && (
          <div className="panel" style={{ background: "rgba(255,255,255,0.45)", marginBottom: 12 }}>
            <strong>Fel:</strong> {error}
          </div>
        )}

        <div className="two-col">
          {/* Login */}
          <section>
            <h2 className="panel-title">Logga in</h2>
            <div className="form-grid">
              <label>
                <span className="label">E-post</span>
                <input
                  className="input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="namn@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                <span className="label">Lösenord</span>
                <input
                  className="input"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Ditt lösenord"
                  autoComplete="current-password"
                />
              </label>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={login} disabled={busy}>
                  {busy ? "Vänta…" : "Logga in"}
                </button>
              </div>
            </div>
          </section>

          {/* Register */}
          <section>
            <h2 className="panel-title">Registrera</h2>
            <div className="form-grid">
              <label>
                <span className="label">E-post</span>
                <input
                  className="input"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="namn@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                <span className="label">Lösenord</span>
                <input
                  className="input"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Minst 6 tecken"
                  autoComplete="new-password"
                />
              </label>

              <div className="form-actions">
                <button className="btn" onClick={register} disabled={busy}>
                  {busy ? "Vänta…" : "Registrera"}
                </button>
              </div>

              <p style={{ margin: 0, fontSize: 12, opacity: 0.95 }}>
                Tips: Lösenord måste vara minst 6 tecken.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
