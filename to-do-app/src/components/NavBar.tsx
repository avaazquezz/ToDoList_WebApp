import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <div className="nav-brand">WorkToDo App</div>
      <div className="nav-menu">
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