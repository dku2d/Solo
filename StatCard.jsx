export default function StatCard({ title, value, icon, dark = false }) {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>

      <div className={`stat-icon ${dark ? "dark" : ""}`}>{icon}</div>
    </div>
  );
}
