import TopBar from "./TopBar.jsx";

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <div className="adminShell">
      <TopBar title={title} subtitle={subtitle} />
      <main className="adminMain">
        {children}
      </main>
    </div>
  );
}
