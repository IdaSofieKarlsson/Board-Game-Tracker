import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Header />
      <main style={{ flex: 1, padding: 16 }}>{children}</main>
      <Footer />
    </div>
  );
}
