import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Games from "./pages/Games";
import { AppShell } from "./components/AppShell";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Overview />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Games />
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
