//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Games from "./pages/Games";
import { Header } from "./components/Header";

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
                <Header />
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <Header />
                <Games />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
