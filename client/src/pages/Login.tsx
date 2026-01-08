import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/overview");
    } catch (e: any) {
      console.error(e);
      setError(e?.code ?? "Login failed");
    }
  }

  async function register() {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/overview");
    } catch (e: any) {
      console.error(e);
      setError(e?.code ?? "Registration failed");
    }
  }

  return (
    <div>
      <h1>Login / Register</h1>

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>

      {error && <p>{error}</p>}
    </div>
  );
}