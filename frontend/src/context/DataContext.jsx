import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { checkLogin as fetchAuthSession } from "../api/auth.service.js";

export const DataContext = createContext(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export function DataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetchAuthSession();
        if (res.success) {
          setUser(res.user);
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [clearSession]);

  if (loading) {
    return null;
  }

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        clearSession,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
