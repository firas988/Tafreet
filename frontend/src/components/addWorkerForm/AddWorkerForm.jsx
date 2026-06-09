import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, UserPlus, X } from "lucide-react";
import modal from "../modal/modal.shared.module.css";
import classes from "./AddWorkerForm.module.css";

export default function AddWorkerForm({ onSubmit, onClose, loading, error }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password" || name === "confirm_password") {
      setLocalError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirm_password) {
      setLocalError("Passwords do not match");
      return;
    }

    onSubmit({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      is_active: form.is_active ? 1 : 0,
    });
  };

  const displayError = localError || error;

  return (
    <div className={modal.overlay} onClick={onClose}>
      <form
        className={modal.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className={modal.headerIcon}>
            <UserPlus size={22} />
          </div>
          <div>
            <span className="pill">New Staff</span>
            <h2>Add Worker</h2>
            <p>Create a worker account for your restaurant team.</p>
          </div>
          <button className={modal.closeBtn} type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={modal.body}>
          <div className={classes.roleBadge}>
            <ShieldCheck size={16} />
            <span>Account role will be set to worker automatically</span>
          </div>

          {displayError && <p className={modal.error}>{displayError}</p>}

          <div className={classes.fields}>
            <div className={classes.nameRow}>
              <label className={modal.field}>
                <span>First name</span>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className={modal.field}>
                <span>Last name</span>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className={modal.field}>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="worker@restaurant.com"
                required
              />
            </label>

            <label className={modal.field}>
              <span>Password</span>
              <div className={classes.passwordWrap}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 chars with upper, lower, number & symbol"
                  required
                />
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

            <label className={modal.field}>
              <span>Confirm password</span>
              <div className={classes.passwordWrap}>
                <input
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
                <button
                  className={classes.eyeBtn}
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className={classes.toggle}>
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span className={classes.toggleTrack}>
                <span className={classes.toggleThumb} />
              </span>
              <span className={classes.toggleText}>
                <b>Active account</b>
                <small>Worker can log in immediately</small>
              </span>
            </label>
          </div>
        </div>

        <div className={modal.footer}>
          <div className={modal.actions}>
            <button className="btn light" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Worker"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
