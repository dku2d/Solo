import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "admin@propertyhub.com",
    password: "Password123!",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("propertyhub_token", response.data.token);
      localStorage.setItem("propertyhub_user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">PropertyHub</div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Use the seeded demo account to open the dashboard.</p>

        <label className="field-label">
          Email
          <input
            className="field-input"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </label>

        <label className="field-label">
          Password
          <input
            className="field-input"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            required
          />
        </label>

        {error ? <div className="form-error">{error}</div> : null}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="demo-note">
          Demo login: admin@propertyhub.com / Password123!
        </div>
      </form>
    </div>
  );
}
