import { Link, useLocation } from "react-router-dom";
import { ChefHat, LayoutDashboard, ListOrdered, LogOut, Menu, Users } from "lucide-react";

export default function TopBar({ title = "Dashboard", subtitle = "Manage your restaurant" }) {
  const location = useLocation();

  const links = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/worker", label: "Orders", icon: ListOrdered },
    { path: "/admin/menu", label: "Menu", icon: Menu },
    { path: "/admin/staff", label: "Staff", icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandIcon"><ChefHat size={22} /></div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <nav className="navLinks">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;
          return (
            <Link className={active ? "navItem active" : "navItem"} to={link.path} key={link.path}>
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link className="navItem logout" to="/login">
        <LogOut size={18} />
        Logout
      </Link>
    </aside>
  );
}
