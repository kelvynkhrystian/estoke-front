import "./login.css";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { getConfig } from "../../services/configService";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { Mail, Lock } from "lucide-react";
import Logo from "../../assets/logo/logo.png"


// 🔥 mock temporário (depois vem da API)

const appConfig = {
  name: "Estoke",
  slogan: "Seu app de estoque",
};

// setar favicon
const setFavicon = (url) => {
  const existing = document.querySelector("link[rel~='icon']");

  if (existing) {
    existing.href = url;
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url;
    document.head.appendChild(link);
  }
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        // console.log("CONFIG:", data);

        setConfig(data);

      } catch (err) {
        console.error("Erro ao buscar config", err);
      }
    };

    fetchConfig();
  }, []);


  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      navigate("/painel");
    } catch (err) {
      alert("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* 🔥 fundo */}
      <div className="login-background" />

      {/* 🔥 toggle */}
      <div className="theme-toggle">
        <ThemeToggle />
      </div>

      <img
        src={
          config?.logo_url
            ? `${import.meta.env.VITE_API_URL}${config.logo_url}?t=${Date.now()}`
            : Logo
        }
        alt="logo"
        className="logo"
      />

      {/* 🔥 conteúdo */}
      <div className="login-card">

        <h1 className="app-name">
          {config?.app_name || appConfig.name}
        </h1>

        <p className="app-slogan">
          {config?.slogan || appConfig.slogan}
        </p>

        <form onSubmit={handleLogin} className="form">

          <div className="input-group">
            <Mail size={18} className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="icon" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* <span className="forgot">Esqueceu sua senha?</span> */}

        </form>
      </div>
    </div>
  );
}
