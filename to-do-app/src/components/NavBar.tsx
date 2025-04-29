import { Link,  useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';


const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav>
      

      <div className="nav-brand">WorkToDo App</div>
      
      <div className="nav-menu">
          <button 
            className="back-to-home-button" 
            onClick={() => navigate('/home')}
          >
            Proyectos
          </button>
        <button className="settings-button">
          Configuración
          <div className="dropdown-menu">
            <Link to="/">Logout</Link>
            <Link to="/about">Más información</Link>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;