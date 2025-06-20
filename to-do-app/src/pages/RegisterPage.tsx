import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Reemplaza con la llamada a tu API de Node.js
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse.');
      }

      // Guarda el token o los datos de la sesión si es necesario
      localStorage.setItem('authToken', data.token);
      navigate('/home');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al registrarse. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Crear cuenta</h1>
          <p>Completa los siguientes datos para registrarte</p>
        </div>

        <form onSubmit={handleRegister}>
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
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </form>

        <div className="alternative-actions">
          <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;