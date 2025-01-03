import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Agregar estado de carga

  async function getUser() {
    if (token) {
      const res = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setRole(data.role);
      } else {
        setUser(null);
        setRole(null);
      }
    }
  }

  useEffect(() => {
    if (token) {
      getUser().finally(() => setIsLoading(false)); // Cuando termine la carga, actualizar el estado
    } else {
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, role, setRole, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}