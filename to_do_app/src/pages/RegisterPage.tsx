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

const apiUrl = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading, dismissAll } = useNotification();

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
      <div className="register-card">
        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Regístrate para comenzar</p>
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              className="form-input"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu nombre"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-container">
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          
          <button type="submit" className="register-button" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="login-prompt">
          ¿Ya tienes cuenta? <br />
          <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
