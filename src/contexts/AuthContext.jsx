import { createContext, useState, useEffect } from "react";
import { api } from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 persistência simples (sem /me)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (token && userStorage) {
      setUser(JSON.parse(userStorage));
    }

    setLoading(false);
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { accessToken, user } = res.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (e) {
      console.log("erro logout (ignorado)");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");

    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}