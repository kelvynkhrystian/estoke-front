import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Settings, LogOut, TriangleAlert, Sun, Moon } from "lucide-react";
import "./header.css";

import { getConfig } from "../../services/configService";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [config, setConfig] = useState(null);

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Erro ao carregar config", err);
      }
    };

    fetchConfig();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro ao sair", err);
    }
  };

  const baseURL = import.meta.env.VITE_API_URL;

  const logoUrl = config?.logo_url
    ? `${baseURL}${config.logo_url}`
    : null;

  return (
    <header className="app-header">
      <div className="app-header-left">
        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="app-logo" />
        )}

        <div className="app-info">
          <strong>{config?.app_name || "Estoke"}</strong>
          <span>Olá, {user?.name || "Usuário"}</span>
        </div>
      </div>

      <div className="app-header-right">
        <button
          className="theme-button"
          onClick={toggleTheme}
          type="button"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          type="button"
        >
          <Menu size={20} />
        </button>

        {menuOpen && (
          <div className="dropdown">
            <Link
              to="/alertas"
              className="dropdown-item"
              onClick={() => setMenuOpen(false)}
            >
              <TriangleAlert size={18} />
              <span>Alertas</span>
            </Link>

            <Link
              to="/config"
              className="dropdown-item"
              onClick={() => setMenuOpen(false)}
            >
              <Settings size={18} />
              <span>Configurações</span>
            </Link>

            <button
              type="button"
              className="dropdown-item danger dropdown-button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}