import TopBar from "../topBar/TopBar.jsx";
import classes from "./AdminLayout.module.css";

export default function AdminLayout({
  children,
  title,
  subtitle,
  variant = "admin",
}) {
  return (
    <div className={classes.adminShell}>
      <TopBar title={title} subtitle={subtitle} variant={variant} />
      <main className={classes.adminMain}>{children}</main>
    </div>
  );
}
