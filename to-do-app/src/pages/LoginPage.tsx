import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Por favor, confirma tu correo electrónico antes de iniciar sesión.');
        } else {
          setError(error.message);
        }
      } else {
        navigate('/home');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      navigate('/home');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión con Google');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Iniciar sesión</h1>
          <p>Bienvenido de nuevo, accede a tu cuenta</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className="forgot-password">
              <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="divider">O continúa con</div>

        <div className="social-login">
          <div className="social-buttons">
            <button 
              type="button"
              className="social-button" 
              onClick={handleGoogleSignIn}
              aria-label="Iniciar sesión con Google"
            >
              <img 
                src="../assets/logoGoogle.jpg" 
                alt="Google" 
              />
            </button>
            {/* Puedes añadir más botones para otros proveedores aquí */}
          </div>
        </div>

        <div className="signup-prompt">
          ¿No tienes una cuenta?
          <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;