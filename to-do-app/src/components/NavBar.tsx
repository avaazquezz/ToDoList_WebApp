import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Navbar.css';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Cierra la sesión en Supabase
      localStorage.removeItem('supabase.auth.token'); // Limpia el token del localStorage
      navigate('/'); // Redirige al usuario a la página principal
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav>
      

      <div className="nav-brand" onClick={() => navigate('/')}>WorkToDo App</div>
      
      <div className="nav-menu">
          <button 
            className="back-to-home-button" 
            onClick={() => navigate('/home')}
          >
            Proyectos
          </button>
        <button className="settings-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;