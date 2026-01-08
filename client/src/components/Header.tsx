import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import KnappenAvatar from "../assets/KnappenAvatarImproved.webp";

export function Header() {
  const navigate = useNavigate();

  async function logout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        borderBottom: "1px solid #ccc"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={KnappenAvatar}
          alt="Knappen"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
        <strong>Knappen’s Board Game Tracker</strong>
      </div>

      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/overview">Overview</Link>
        <Link to="/games">Games</Link>
        <button onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
