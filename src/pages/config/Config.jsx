import { useState } from "react";
import { ArrowLeft, Settings, Key, Info, Upload, Mail, Lock, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./config.css";

export default function Config() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("geral");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="config-page">

      {/* HEADER */}
      <div className="config-header">
        <button className="config-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="config-title">
          <div className="config-icon">
            <Settings size={20} />
          </div>

          <div>
            <h1>Configurações</h1>
            <p>Gerencie sua conta e preferências do sistema</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="config-tabs">

        <button
          className={tab === "geral" ? "active" : ""}
          onClick={() => setTab("geral")}
        >
          <Settings size={16} />
          Geral
        </button>

        <button
          className={tab === "credenciais" ? "active" : ""}
          onClick={() => setTab("credenciais")}
        >
          <Key size={16} />
          Credenciais
        </button>

        <button
          className={tab === "info" ? "active" : ""}
          onClick={() => setTab("info")}
        >
          <Info size={16} />
          Info
        </button>

      </div>

      {/* CONTEÚDO */}
      <div className="config-content">

        {/* 🔥 GERAL */}
        {tab === "geral" && (
          <div className="config-card">
            <h3>Geral</h3>

            <div className="config-form">
              <input placeholder="Nome do App" />
              <input placeholder="Slogan" />

              {/* LOGO */}
              <div className="config-upload">
                <span>Logo do sistema</span>

                <label className="upload-btn">
                  <Upload size={16} />
                  Selecionar
                  <input type="file" hidden onChange={handleLogoChange} />
                </label>
              </div>

              {/* PREVIEW */}
              {preview && (
                <div className="logo-preview">
                  <img src={preview} alt="preview" />
                </div>
              )}

              <button className="btn-save">
                Salvar configurações
              </button>
            </div>
          </div>
        )}

        {/* 🔥 CREDENCIAIS */}
        {tab === "credenciais" && (
          <div className="config-credentials">

            {/* EMAIL */}
            <div className="config-card">
              <h3><Mail size={16}/> Alterar Email</h3>

              <div className="config-form">
                <input placeholder="Email atual" />
                <input placeholder="Novo email" />
                <input placeholder="Senha atual" />

                <button className="btn-save">
                  Atualizar Email
                </button>
              </div>
            </div>

            {/* SENHA */}
            <div className="config-card">
              <h3><Lock size={16}/> Alterar Senha</h3>

              <div className="config-form">
                <input placeholder="Senha atual" />
                <input placeholder="Nova senha" />
                <input placeholder="Confirmar nova senha" />

                <button className="btn-save">
                  Atualizar Senha
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 🔥 INFO */}
        {tab === "info" && (
          <div className="config-card info-card">

            <div className="info-row">
              <strong>App:</strong>
              <span>Estoke</span>
            </div>

            <div className="info-row">
              <strong>Versão:</strong>
              <span>1.0.0</span>
            </div>

            <div className="info-row">
              <strong>Desenvolvedor:</strong>
              <span>KelvynK</span>
            </div>

            <a href="https://wa.me/5598991054292" target="_blank" className="btn-support">
              <MessageCircle size={18} />
              Suporte via WhatsApp
            </a>

          </div>
        )}

      </div>
    </div>
  );
}