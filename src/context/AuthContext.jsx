import { createContext, useContext, useEffect, useState } from 'react';
import { TOKEN_KEY } from '../api/client';
import { authApi } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (localStorage.getItem(TOKEN_KEY)) setUser(await authApi.me());
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSession = ({ user, token }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const login = async (email, password) =>
    saveSession(await authApi.login({ email, password }));

  const register = async (payload) =>
    saveSession(await authApi.register(payload));

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);