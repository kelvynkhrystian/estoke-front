import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/theme/ThemeToggle";
import "./login.css";
import Logo from "../../assets/logo/logo.png"
import { Mail, Lock } from "lucide-react";

// 🔥 mock temporário (depois vem da API)


const appConfig = {
  name: "Estoque",
  slogan: "Gestão inteligente de estoque",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      <div className="login-title">
        <img src={Logo} alt="logo" className="logo" />

        
      </div>

      {/* 🔥 conteúdo */}
      <div className="login-card">

        {/* <img src={Logo} alt="logo" className="logo" />
        <h1 className="app-name">{appConfig.name}</h1>
        <p className="app-slogan">{appConfig.slogan}</p> */}
        <h1 className="app-name">{appConfig.name}</h1>
        <p className="app-slogan">{appConfig.slogan}</p>

        {/* <h1 className="app-name-login">Login</h1> */}

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
