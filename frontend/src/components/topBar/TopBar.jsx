import { Link, useLocation } from "react-router-dom";
import {
  ChefHat,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Table2,
  Users,
} from "lucide-react";
import classes from "./TopBar.module.css";

export default function TopBar({
  title = "Dashboard",
  subtitle = "Manage your restaurant",
}) {
  const location = useLocation();

  const links = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/worker", label: "Orders", icon: ListOrdered },
    { path: "/admin/menu", label: "Menu", icon: Menu },
    { path: "/admin/tables", label: "Tables", icon: Table2 },
    { path: "/admin/staff", label: "Staff", icon: Users },
  ];

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

      <Link className={`${classes.navItem} ${classes.logout}`} to="/login">
        <LogOut size={18} />
        Logout
      </Link>
    </aside>
  );
}
