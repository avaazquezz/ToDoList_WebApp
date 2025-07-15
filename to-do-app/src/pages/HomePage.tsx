import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/HomePage.css';

const colorOptions = [
  '#4a90e2', '#50c878', '#f39c12', '#e74c3c', '#9b59b6',
  '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b'
];

interface Notification {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
}

// Define the Project type
interface Project {
  id: number;
  name: string;
  color: string;
  createdBy: string;
  createdAt: number;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, title, message };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Función para cerrar notificación manualmente
  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Obtener proyectos del usuario
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/user/${userId}`);
        const data = await response.json();
        const updatedProjects = data.map((project: any) => ({
          ...project,
          createdBy: project.creatorName, // Usar el nombre del creador
        }));
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };

    fetchProjects();
  }, []);

  // Guardar proyectos en localStorage
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Verificar sesión
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddProject = async () => {
    if (newProjectName.trim() === '') {
      showNotification('error', 'Campo requerido', 'El nombre del proyecto no puede estar vacío.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      showNotification('error', 'Sesión expirada', 'No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    try {
      const createdAt = Date.now();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          color: selectedColor,
          created_by: userId,
          created_at: createdAt
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error('Error al crear el proyecto.');
      }

      const data = await response.json();

      const newProject: Project = {
        id: data.id,
        name: newProjectName,
        color: selectedColor,
        createdBy: userId,
        createdAt
      };

      setProjects(prev => [...prev, newProject]);
      setNewProjectName('');
      setSelectedColor(colorOptions[0]);
      setShowColorPicker(false);
      showNotification('success', 'Proyecto creado', 'El proyecto se ha creado exitosamente.');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      showNotification('error', 'Error al crear proyecto', 'Ocurrió un error al crear el proyecto. Inténtalo de nuevo.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProject();
    }
  };

  const navigateToProjectTasks = (projectName: string) => {
    const encodedName = encodeURIComponent(projectName);
    navigate(`/project/${encodedName}/sections`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
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
              
              <button onClick={handleAddProject}>
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
                    <div className="project-header-content">
                      <h3>{project.name}</h3>
                      <button
                        className="info-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTooltip(activeTooltip === project.id ? null : project.id);
                        }}
                        aria-label="Mostrar información del proyecto"
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </button>
                    </div>                    {activeTooltip === project.id && (
                      <div className="project-info-tooltip" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#f8f9fa',
                        color: '#333',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        zIndex: 10,
                        textAlign: 'left',
                        width: '80%',
                        maxWidth: '300px'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltip(null);
                          }}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255, 59, 48, 0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ff3b30',
                            transition: 'all 0.2s ease',
                            width: '30px',
                            height: '30px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          aria-label="Cerrar información"
                        >
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                        <p><strong>Creado por:</strong> {project.createdBy}</p>
                        <p><strong>Fecha:</strong> {formatDate(project.createdAt)}</p>
                      </div>
                    )}
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

        {/* Notificaciones */}
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <div className="notification-icon">
              {notification.type === 'success' ? '✓' : '⚠'}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button 
              className="notification-close" 
              onClick={() => closeNotification(notification.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;