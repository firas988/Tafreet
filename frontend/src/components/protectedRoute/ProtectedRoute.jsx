import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext.jsx";

export default function ProtectedRoute({ children, role = null }) {
  const navigate = useNavigate();
  const { user } = useData();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const userRole = user.role?.toLowerCase();

    if (role && userRole !== role) {
      navigate(userRole === "admin" ? "/admin" : "/worker", { replace: true });
      return;
    }

    setAllowed(true);
  }, [navigate, role, user]);

  if (!allowed) {
    return null;
  }

  return children;
}
