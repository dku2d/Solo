import { Building2, CreditCard, LayoutDashboard, Users, Wrench } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Properties", icon: Building2 },
  { label: "Tenants", icon: Users },
  { label: "Payments", icon: CreditCard },
  { label: "Maintenance", icon: Wrench },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">PropertyHub</div>

      <nav className="sidebar-nav">
        {items.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`sidebar-item ${active ? "active" : ""}`}
            type="button"
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
