import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Sparkles } from "lucide-react";
import { login } from "../../../api/auth.service.js";
import classes from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, password });

      if (!result.success) {
        setError(result.message || "Login failed");
        return;
      }

      if (result.user?.role === "admin") {
        navigate("/admin");
        return;
      }

      if (result.user?.role === "worker") {
        navigate("/worker");
        return;
      }

      setError("Unknown user role");
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.loginPage}>
      <div className={classes.loginArt}>
        <div className={classes.glassCard}>
          <Sparkles />
          <h1>Tafreet</h1>
          <p>
            Beautiful digital menu and order management system for modern
            restaurants.
          </p>
        </div>
      </div>

      <form className={classes.loginCard} onSubmit={handleSubmit}>
        <span className="pill">Restaurant Portal</span>
        <h2>Welcome back</h2>
        <p>Login to manage live orders.</p>

        {error && <p className={classes.error}>{error}</p>}

        <label>
          <span>Email</span>
          <div className={classes.inputIcon}>
            <Mail size={18} />
            <input
              placeholder="admin@restaurant.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </label>

        <label>
          <span>Password</span>
          <div className={classes.inputIcon}>
            <Lock size={18} />
            <input
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </label>

        <button className="btn full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
