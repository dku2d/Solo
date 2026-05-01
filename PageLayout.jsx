import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageLayout({ title, action, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />

        <section className="page-content">
          <div className="page-header-row">
            <h1 className="page-title small">{title}</h1>
            {action}
          </div>

          {children}
        </section>
      </main>
    </div>
  );
}