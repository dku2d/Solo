import { Building2, DollarSign, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Topbar from "../components/Topbar";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_properties: 0,
    active_tenants: 0,
    monthly_revenue: 0,
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("propertyhub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (err) {
        setError("Could not load dashboard data. Please log in again.");
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar user={user} />

        <section className="page-content">
          <h1 className="page-title">Dashboard</h1>

          {error ? <div className="error-banner">{error}</div> : null}

          <div className="stats-grid">
            <StatCard
              title="Total Properties"
              value={stats.total_properties}
              icon={<Building2 size={28} />}
              dark
            />
            <StatCard
              title="Active Tenants"
              value={stats.active_tenants}
              icon={<Users size={28} />}
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${Number(stats.monthly_revenue).toLocaleString()}`}
              icon={<DollarSign size={28} />}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
