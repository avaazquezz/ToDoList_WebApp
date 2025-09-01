/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import '../styles/LoginPage.css';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const apiUrl = import.meta.env.VITE_API_URL;


const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading, dismissAll } = useNotification();

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mostrar notificación de carga
    const toastId = showLoading(t('login.loading'));

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('login.error'));
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id.toString());

      // Cerrar toast de loading y mostrar éxito
      dismissAll();
      showSuccess(t('login.success'));
      
      // Pequeña pausa para que se vea la notificación antes de navegar
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1000);

    } catch (err: any) {
      const errorMessage = err.message || t('login.error');
      
      // Cerrar toast de loading y mostrar error
      dismissAll();
      showError(errorMessage);
      
      console.error('Error en el login:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Selector de idioma arriba a la derecha solo en LoginPage */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <LanguageSelector />
      </div>
      <div className="login-card">
        <div className="login-header">
          <h1>{t('login.header')}</h1>
          <p>{t('login.subheader')}</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">{t('login.email')}</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('login.password')}</label>
            <div className="password-container">
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? t('login.hide') : t('login.show')}
              </button>
            </div>
            <div className="forgot-password">
              <a href="/forgot-password">{t('login.forgot')}</a>
            </div>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? t('login.loading') : t('login.button')}
          </button>
        </form>
        <div className="signup-prompt">
          {t('login.signupPrompt')}
          <Link to="/register">{t('login.signupLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
