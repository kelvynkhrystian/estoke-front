import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Settings, LogOut, TriangleAlert, Sun, Moon } from "lucide-react";
import "./header.css";

import { getConfig } from "../../services/configService";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [config, setConfig] = useState(null);

  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  const baseURL = import.meta.env.VITE_API_URL;

  const logoUrl = config?.logo_url
    ? `${baseURL}${config.logo_url}`
    : null;

  return (
    <header className="app-header">
      {/* esquerda */}
      <div className="app-header-left">
        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="app-logo" />
        )}

        <div className="app-info">
          <strong>{config?.app_name || "Estoke"}</strong>

          {/* 🔥 NOVO */}
          <span>
            Olá, {user?.name || "Usuário"}
          </span>
        </div>
      </div>

      {/* direita */}
      <div className="app-header-right">
        
        {/* 🔥 BOTÃO TEMA */}
        <button className="theme-button" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* menu */}
        <button
          className="menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Menu size={20} />
        </button>

        {menuOpen && (
          <div className="dropdown">

            {/* 🔥 ALERTAS (novo) */}
            <Link to="/alertas" className="dropdown-item">
              <TriangleAlert size={18} />
              <span>Alertas</span>
            </Link>

            <Link to="/config" className="dropdown-item">
              <Settings size={18} />
              <span>Configurações</span>
            </Link>

            <Link to="/logout" className="dropdown-item danger">
              <LogOut size={18} />
              <span>Sair</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}