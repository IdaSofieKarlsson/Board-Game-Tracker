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
    <header className="header-inner">
        <div className="brand">
            <img className="avatar" src={KnappenAvatar} alt="Knappen" />
            <div className="brand-title">Knappens Brädspels-Portal</div>
        </div>

        <nav className="nav">
            <Link to="/overview">Översikt</Link>
            <Link to="/games">Spel</Link>
            <button className="btn" onClick={logout}>Logga ut</button>
        </nav>
    </header>

  );
}
