import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../api/auth.service.js";
import { isAuthError } from "../../utils/auth.js";

export default function ProtectedRoute({ children, role = null }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkLogin();

        if (!result.success || isAuthError(result.message)) {
          navigate("/login", { replace: true });
          return;
        }

        const userRole = result.user?.role?.toLowerCase();

        if (role && userRole !== role) {
          navigate("/login", { replace: true });
          return;
        }

        setAllowed(true);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    verify();
  }, [navigate, role]);

  if (!allowed) {
    return null;
  }

  return children;
}
