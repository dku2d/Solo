import { Search, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Topbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("propertyhub_token");
    localStorage.removeItem("propertyhub_user");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="search-shell">
        <Search size={22} className="search-icon" />
        <input className="search-input" placeholder="Search..." />
      </div>

      <div className="topbar-actions">
        <Link to="/login" className="login-link">
          Login
        </Link>
        <button
          className="profile-button"
          type="button"
          title={user?.full_name || "Profile"}
          onClick={handleLogout}
        >
          <UserRound size={24} />
        </button>
      </div>
    </header>
  );
}
