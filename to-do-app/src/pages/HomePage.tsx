/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
  };
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useNotification } from '../hooks/useNotification';
import EditProjectModal from '../components/EditProjectModalNew';
import '../styles/HomePage.css';

const colorOptions = [
  '#4a90e2', '#50c878', '#f39c12', '#e74c3c', '#9b59b6',
  '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b'
];

// Define the Project type
interface Project {
  id: number;
  name: string;
  color: string;
  description: string; // Added description property
  createdBy: string;
  createdAt: number;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { showSuccess, showError, showWarning } = useNotification();

  // Obtener proyectos del usuario
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/user/${userId}`);
        const data = await response.json();
        const updatedProjects = data.map((project: any) => ({
          ...project,
          createdBy: project.creatorName || project.createdBy || 'Usuario', // Usar el nombre del creador
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

  const handleEditProject = async (projectData: {
    name: string;
    description: string;
    color: string;
  }) => {
    if (!editingProject) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el proyecto');
      }

      // Update the project in the local state
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? { ...project, ...projectData }
          : project
      ));

      setEditingProject(null);
      showSuccess('Proyecto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating project:', error);
      showError('Ocurrió un error al actualizar el proyecto. Inténtalo de nuevo.');
    }
  };

  const handleAddProject = async () => {
    if (newProjectName.trim() === '') {
      showError('El nombre del proyecto no puede estar vacío.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      showError('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
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
          description: newProjectDescription,
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
        description: newProjectDescription, // Include description here
        createdBy: userId,
        createdAt
      };

      setProjects(prev => [...prev, newProject]);
      setNewProjectName('');
      setNewProjectDescription('');
      setSelectedColor(colorOptions[0]);
      setShowColorPicker(false);
      showSuccess('¡Proyecto creado exitosamente!');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      showError('Ocurrió un error al crear el proyecto. Inténtalo de nuevo.');
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
            <h2 className="projects-header-title">
              Mis Proyectos
            </h2>
          </div>

          <div className="add-project-container">
            <div className="add-project add-project-wrapper">
              <input
                type="text"
                placeholder="Nombre del nuevo proyecto"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="project-name-input"
              />
              
              <input
                type="text"
                placeholder="Descripción del proyecto (opcional)"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="project-description-input"
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
              
              <button 
                onClick={handleAddProject}
                className="add-project-button"
              >
                Crear Proyecto
              </button>
            </div>
          </div>

          <div className="project-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card project-card-custom"
                  onClick={() => navigateToProjectTasks(project.name)}
                >
                  <div 
                    className="project-color-bar" 
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <div className="project-content">
                    <div className="project-header-content">
                      <div className="project-info-section">
                        <h3 className={`project-title ${project.description ? 'project-title-with-description' : ''}`}>
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="project-description">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="project-actions">
                        <button
                          className="info-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltip(activeTooltip === project.id ? null : project.id);
                          }}
                          aria-label="Mostrar información del proyecto"
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(34, 197, 94, 1)';
                            // Crear tooltip si no existe
                            if (!e.currentTarget.querySelector('.info-tooltip')) {
                              const tooltip = document.createElement('div');
                              tooltip.className = 'info-tooltip';
                              tooltip.textContent = 'Ver información';
                              tooltip.style.cssText = `
                              position: absolute;
                              top: -35px;
                              left: 50%;
                              transform: translateX(-50%);
                              background: rgba(0, 0, 0, 0.8);
                              color: white;
                              padding: 6px 12px;
                              border-radius: 6px;
                              font-size: 12px;
                              font-weight: 500;
                              white-space: nowrap;
                              z-index: 1000;
                              pointer-events: none;
                              opacity: 0;
                              transition: opacity 0.2s ease;
                              `;
                              e.currentTarget.style.position = 'relative';
                              e.currentTarget.appendChild(tooltip);
                              setTimeout(() => {
                              tooltip.style.opacity = '1';
                              }, 50);
                            }
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                            // Eliminar tooltip al quitar el mouse
                            const tooltip = e.currentTarget.querySelector('.info-tooltip') as HTMLElement;
                            if (tooltip) {
                              tooltip.style.opacity = '0';
                              setTimeout(() => {
                                if (tooltip.parentNode) {
                                  tooltip.parentNode.removeChild(tooltip);
                                }
                              }, 200);
                            }
                          }}
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
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        </button>
                        <button
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                          }}
                          aria-label="Editar proyecto"
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 145, 226, 0.35)';
                            // Crear tooltip si no existe
                            if (!e.currentTarget.querySelector('.edit-tooltip')) {
                              const tooltip = document.createElement('div');
                              tooltip.className = 'edit-tooltip';
                              tooltip.textContent = 'Editar proyecto';
                              tooltip.style.cssText = `
                              position: absolute;
                              top: -35px;
                              left: 50%;
                              transform: translateX(-50%);
                              background: rgba(0, 0, 0, 0.8);
                              color: white;
                              padding: 6px 12px;
                              border-radius: 6px;
                              font-size: 12px;
                              font-weight: 500;
                              white-space: nowrap;
                              z-index: 1000;
                              pointer-events: none;
                              opacity: 0;
                              transition: opacity 0.2s ease;
                              `;
                              e.currentTarget.style.position = 'relative';
                              e.currentTarget.appendChild(tooltip);
                              setTimeout(() => {
                              tooltip.style.opacity = '1';
                              }, 50);
                            }
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 144, 226, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                            // Eliminar tooltip al quitar el mouse
                            const tooltip = e.currentTarget.querySelector('.edit-tooltip') as HTMLElement;
                            if (tooltip) {
                              tooltip.style.opacity = '0';
                              setTimeout(() => {
                                if (tooltip.parentNode) {
                                  tooltip.parentNode.removeChild(tooltip);
                                }
                              }, 200);
                            }
                          }}
                        >
                          ✎
                        </button>
                      </div>
                    </div>                    
                    
                    {activeTooltip === project.id && (
                      <>
                        {/* Overlay para cerrar al hacer clic fuera */}
                        <div 
                          className="modal-overlay-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltip(null);
                          }}
                        />
                        
                        <div className="project-info-tooltip">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(null);
                            }}
                            className="close-tooltip-button"
                            aria-label="Cerrar información"
                          >
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2.5"
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                          
                          <div className="info-container-with-margin">
                            <h4 className="info-title">
                              Información del Proyecto
                            </h4>
                          </div>
                          
                          <div className="info-column-container">
                            <div className="info-item">
                              <div className="user-avatar">
                                {project.createdBy.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="info-label">
                                  Creado por
                                </p>
                                <p className="info-value-creator">
                                  {project.createdBy}
                                </p>
                              </div>
                            </div>
                            
                            <div className="info-item">
                              <div className="date-icon-container">
                                <svg 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2"
                                >
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="date-label">
                                  Fecha de creación
                                </p>
                                <p className="date-value">
                                  {formatDate(project.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
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

        {/* Nuevo Modal Profesional */}
        <EditProjectModal
          isOpen={editingProject !== null}
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleEditProject}
        />
      </div>
    </div>
  );
};

export default HomePage;