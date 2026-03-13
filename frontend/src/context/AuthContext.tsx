import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type UserRole = 'user' | 'admin' | 'ngo';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  trust_score?: number;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (data: { token: string; user: AuthUser }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('locatehope_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          user: AuthUser;
          token: string;
        };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        // ignore
      }
    }
  }, []);

  const login = (data: { token: string; user: AuthUser }) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(
      'locatehope_auth',
      JSON.stringify({ user: data.user, token: data.token }),
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('locatehope_auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

