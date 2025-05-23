import '../styles/HomePage.css';
import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate


type Project = {
  id: number;
  name: string;
  color: string;
};

// Array de colores predefinidos para elegir
const colorOptions = [
  '#4a90e2', // azul
  '#50c878', // verde
  '#f39c12', // naranja
  '#e74c3c', // rojo
  '#9b59b6', // morado
  '#3498db', // azul claro
  '#2ecc71', // verde claro
  '#f1c40f', // amarillo
  '#e67e22', // naranja oscuro
  '#c0392b'  // rojo oscuro
];

const HomePage = () => {
  const navigate = useNavigate(); // Hook para navegación
  
  // Estado para manejar la lista de proyectos
  const [projects, setProjects] = useState<Project[]>(() => {
    // Cargar proyectos desde localStorage al inicializar
    const storedProjects = localStorage.getItem('projects');
    return storedProjects ? JSON.parse(storedProjects) : [];
  });

  // Estado para manejar el nombre del nuevo proyecto
  const [newProjectName, setNewProjectName] = useState('');
  
  // Estado para manejar el color seleccionado
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  
  // Estado para mostrar/ocultar el selector de colores
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Guardar proyectos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    // Check for session in local storage
    const session = localStorage.getItem('supabase.auth.token');
    if (!session) {
      // If no session, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  // Función para añadir un nuevo proyecto
  const addProject = () => {
    if (newProjectName.trim() === '') {
      alert('El nombre del proyecto no puede estar vacío.');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      color: selectedColor
    };

    setProjects([...projects, newProject]); 
    setNewProjectName('');
    // Resetear el color al predeterminado después de crear
    setSelectedColor(colorOptions[0]);
    setShowColorPicker(false);
  };

  // Función para manejar tecla Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addProject();
    }
  };

  // Función para navegar a la página de tareas del proyecto
  const navigateToProjectTasks = (projectName: string) => {
    //encodeURIComponent maneja correctamente espacios y caracteres especiales en la URL
    const encodedName = encodeURIComponent(projectName);
    navigate(`/project/${encodedName}/sections`);
  };

  return (
    <div className="home-container">
      <NavBar />

      <div className="home-page">
        <div className="welcome-section">
          <h2>Panel de Control</h2>
          <p>Organiza y gestiona todos tus proyectos desde un solo lugar.</p>
          
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Proyectos Activos</span>
            </div>
          </div>
        </div>

        <div className="projects">
          <div className="projects-header">
            <h2>Mis Proyectos</h2>

            <div className="add-project">
              <input
                type="text"
                placeholder="Nombre del nuevo proyecto"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              <div className="color-selector-container">
                <div 
                  className="color-preview" 
                  style={{ backgroundColor: selectedColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                ></div>
                
                {showColorPicker && (
                  <div className="color-picker">
                    {colorOptions.map((color) => (
                      <div 
                        key={color}
                        className="color-option"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          setShowColorPicker(false);
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              
              <button onClick={addProject}>
                Crear Proyecto
              </button>
            </div>
          </div>

          <div className="project-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => navigateToProjectTasks(project.name)}
                >
                  <div 
                    className="project-color-bar" 
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <p className="project-meta">Creado el {new Date(project.id).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-projects">
                <h3>No hay proyectos</h3>
                <p>¡Comienza creando tu primer proyecto!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;