import { Link } from "react-router-dom";
import { Lock, Mail, Sparkles } from "lucide-react";

export default function Login() {
  return (
    <div className="loginPage">
      <div className="loginArt">
        <div className="glassCard">
          <Sparkles />
          <h1>Smart Table</h1>
          <p>Beautiful digital menu and order management system for modern restaurants.</p>
        </div>
      </div>

      <form className="loginCard">
        <span className="pill">Restaurant Portal</span>
        <h2>Welcome back</h2>
        <p>Login as admin or worker to manage live orders.</p>

        <label>
          <span>Email</span>
          <div className="inputIcon">
            <Mail size={18} />
            <input placeholder="admin@restaurant.com" type="email" />
          </div>
        </label>

        <label>
          <span>Password</span>
          <div className="inputIcon">
            <Lock size={18} />
            <input placeholder="••••••••" type="password" />
          </div>
        </label>

        <Link className="btn full" to="/admin">Login as Admin</Link>
        <Link className="btn light full" to="/worker">Login as Worker</Link>
      </form>
    </div>
  );
}
