
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [user, loading, error] = useAuthState(auth);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  // Manejar errores de autenticación
  if (error) {
    console.error('Error al verificar la autenticación:', error);
    return <div className="error">Error al verificar la autenticación. Por favor, intenta nuevamente.</div>;
  }

  // Si el usuario está autenticado, renderizar el contenido protegido
  if (user) {
    return children;
  }

  // Si no está autenticado, redirigir al login
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;