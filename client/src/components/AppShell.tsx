import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="header">
        <div className="content-wrap">
          <Header />
        </div>
      </div>

      <div className="main">
        <div className="content-wrap">
          <div className="main-inner">{children}</div>
        </div>
      </div>

      <div className="footer">
        <div className="content-wrap">
          <Footer />
        </div>
      </div>
    </div>
  );
}
