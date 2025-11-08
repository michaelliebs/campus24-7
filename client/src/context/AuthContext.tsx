import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: any;
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  _id: string;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [API_URL]);

  // Handle login
  const login = async (email: string, password: string) => {
    await axios.post(
      `${API_URL}/users/login`,
      { email, password },
      { withCredentials: true }
    );

    // Re-fetch user after login
    const res = await axios.get(`${API_URL}/users/me`, { withCredentials: true });
    setUser(res.data.user);
  };

  // Handle signup
  const signup = async (data: any) => {
    await axios.post(`${API_URL}/users/signup`, data, { withCredentials: true });

    // Re-fetch user after signup
    const res = await axios.get(`${API_URL}/users/me`, { withCredentials: true });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
