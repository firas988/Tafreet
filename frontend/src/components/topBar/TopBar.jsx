import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChefHat,
  History,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
  Table2,
  Users,
} from "lucide-react";
import { logout } from "../../api/auth.service.js";
import { useData } from "../../context/DataContext.jsx";
import classes from "./TopBar.module.css";

const adminLinks = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/orders", label: "Orders", icon: ListOrdered },
  { path: "/admin/menu", label: "Menu", icon: Menu },
  { path: "/admin/tables", label: "Tables", icon: Table2 },
  { path: "/admin/staff", label: "Staff", icon: Users },
  { path: "/admin/settings", label: "Settings", icon: Settings },
  { path: "/admin/history", label: "History", icon: History },
];

const workerLinks = [
  { path: "/worker", label: "Orders", icon: ListOrdered },
];

export default function TopBar({
  title = "Dashboard",
  subtitle = "Manage your restaurant",
  variant = "admin",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearSession } = useData();
  const links = variant === "worker" ? workerLinks : adminLinks;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Still send user to login if logout request fails
    }
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={classes.sidebar}>
      <div className={classes.brand}>
        <div className={classes.brandIcon}>
          <ChefHat size={22} />
        </div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <nav className={classes.navLinks}>
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;

          return (
            <Link
              className={
                active
                  ? `${classes.navItem} ${classes.active}`
                  : classes.navItem
              }
              to={link.path}
              key={link.path}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        className={`${classes.navItem} ${classes.logout}`}
        type="button"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
