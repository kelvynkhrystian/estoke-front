import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Key,
  Info,
  Upload,
  Mail,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './config.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Config() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('geral');
  const [loading, setLoading] = useState(false);

  // GERAL
  const [appName, setAppName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [logo, setLogo] = useState(null);
  // const [logoUrl, setLogoUrl] = useState('');
  const [preview, setPreview] = useState('');

  // USUÁRIO
  const [currentEmail, setCurrentEmail] = useState('');

  // ALTERAR EMAIL
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  // ALTERAR SENHA
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadConfig();
    loadProfile();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/config`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar configurações');
      }

      setAppName(data.app_name || '');
      setSlogan(data.slogan || '');
      // setLogoUrl(data.logo_url || '');
      setPreview(data.logo_url ? `${API_URL}${data.logo_url}` : '');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar usuário');
      }

      setCurrentEmail(data.email || '');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveConfig = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('app_name', appName);
      formData.append('slogan', slogan);

      if (logo) {
        formData.append('logo', logo);
      }

      const response = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar configurações');
      }

      alert('Configurações atualizadas com sucesso!');

      setLogo(null);
      // setLogoUrl(data.logo_url || '');
      setPreview(
        data.logo_url ? `${API_URL}${data.logo_url}?t=${Date.now()}` : preview,
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/update-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
          password: emailPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar email');
      }

      alert('Email atualizado com sucesso!');
      setCurrentEmail(data.email);
      setNewEmail('');
      setEmailPassword('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        alert('A confirmação da nova senha não confere.');
        return;
      }

      setLoading(true);

      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar senha');
      }

      alert('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-page">
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
            <p>Gerencie sua conta e preferências</p>
          </div>
        </div>
      </div>

      <div className="config-tabs">
        <button
          className={tab === 'geral' ? 'active' : ''}
          onClick={() => setTab('geral')}
        >
          <Settings size={16} />
          Geral
        </button>

        <button
          className={tab === 'credenciais' ? 'active' : ''}
          onClick={() => setTab('credenciais')}
        >
          <Key size={16} />
          Credenciais
        </button>

        <button
          className={tab === 'info' ? 'active' : ''}
          onClick={() => setTab('info')}
        >
          <Info size={16} />
          Info
        </button>
      </div>

      <div className="config-content">
        {tab === 'geral' && (
          <div className="config-card">
            <h3>Geral</h3>

            <div className="config-form">
              <input
                placeholder="Nome do App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />

              <input
                placeholder="Slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />

              <div className="config-upload">
                <span>Logo do sistema</span>

                <label className="upload-btn">
                  <Upload size={16} />
                  Selecionar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>

              {preview && (
                <div className="logo-preview">
                  <img src={preview} alt="preview" />
                </div>
              )}

              <button
                className="btn-save"
                onClick={handleSaveConfig}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar configurações'}
              </button>
            </div>
          </div>
        )}

        {tab === 'credenciais' && (
          <div className="config-credentials">
            <div className="config-card">
              <h3>
                <Mail size={16} /> Alterar Email
              </h3>

              <div className="config-form">
                <input value={currentEmail} disabled />

                <input
                  placeholder="Novo email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Senha atual"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                />

                <button
                  className="btn-save"
                  onClick={handleUpdateEmail}
                  disabled={loading}
                >
                  {loading ? 'Atualizando...' : 'Atualizar Email'}
                </button>
              </div>
            </div>

            <div className="config-card">
              <h3>
                <Lock size={16} /> Alterar Senha
              </h3>

              <div className="config-form">
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  className="btn-save"
                  onClick={handleUpdatePassword}
                  disabled={loading}
                >
                  {loading ? 'Atualizando...' : 'Atualizar Senha'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'info' && (
          <div className="config-card info-card">
            <div className="info-row">
              <strong>App:</strong>
              <span>{appName || 'Estoke'}</span>
            </div>

            <div className="info-row">
              <strong>Versão:</strong>
              <span>1.0.0</span>
            </div>

            <div className="info-row">
              <strong>Desenvolvedor:</strong>
              <span>KelvynK</span>
            </div>

            <a
              href="https://wa.me/5598991054292"
              target="_blank"
              rel="noreferrer"
              className="btn-support"
            >
              <MessageCircle size={18} />
              Suporte via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
