import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { login } from "../../../api/auth.service.js";
import { useData } from "../../../context/DataContext.jsx";
import classes from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    const role = user.role?.toLowerCase();
    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    if (role === "worker") {
      navigate("/worker", { replace: true });
    }
  }, [user, navigate]);

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

      setUser(result.user);

      const role = result.user?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin");
        return;
      }

      if (role === "worker") {
        navigate("/worker");
        return;
      }

      setError(
        result.user
          ? `Unknown user role: ${result.user.role}`
          : "Login succeeded but user data was missing. Try again.",
      );
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
          <div className={classes.passwordWrap}>
            <div className={classes.inputIcon}>
              <Lock size={18} />
              <input
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className={classes.eyeBtn}
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button className="btn full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
