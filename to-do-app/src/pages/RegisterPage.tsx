import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const apiUrl = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [name, setName] = useState('');
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
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('El correo electrónico ya está registrado.');
        } else {
          throw new Error(data.error || 'Error al registrarse.');
        }
        return;
      }

      // Guarda token y userId extrayéndolo de data.user.id
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id.toString());

      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* … mismo JSX … */}
    </div>
  );
};

export default RegisterPage;
