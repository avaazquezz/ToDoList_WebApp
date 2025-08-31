/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import '../styles/RegisterPage.css';
import LanguageSelector from '../components/LanguageSelector';
import { t } from 'i18next';

const apiUrl = import.meta.env.VITE_API_URL;

import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading, dismissAll } = useNotification();

  const { i18n } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mostrar notificación de carga
    const toastId = showLoading('Creando tu cuenta...');

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          dismissAll();
          showError('El correo electrónico ya está registrado.');
        } else {
          throw new Error(data.error || 'Error al registrarse.');
        }
        return;
      }

      // Guarda token y userId extrayéndolo de data.user.id
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id.toString());

      // Cerrar toast de loading y mostrar éxito
      dismissAll();
      showSuccess(`¡Bienvenido ${name}! Tu cuenta ha sido creada exitosamente`);

      // Pequeña pausa para que se vea la notificación antes de navegar
      setTimeout(() => {
        navigate('/home');
      }, 1500);

    } catch (err: any) {
      // Cerrar toast de loading y mostrar error
      dismissAll();
      showError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Selector de idioma arriba a la derecha solo en RegisterPage */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <LanguageSelector />
      </div>
      <div className="register-card">
        <div className="register-header">
          <h1>{t('register.header')}</h1>
          <p>{t('register.subheader')}</p>
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">{t('register.name')}</label>
            <input
              className="form-input"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('register.namePlaceholder')}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('register.email')}</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('register.emailPlaceholder')}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('register.password')}</label>
            <div className="password-container">
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('register.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? t('register.hide') : t('register.show')}
              </button>
            </div>
          </div>
          
          <button type="submit" className="register-button" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? t('register.loading') : t('register.button')}
          </button>
        </form>
        
        <div className="login-prompt">
          {t('register.loginPrompt')} <br />
          <Link to="/login">{t('register.loginLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
