/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
  };
}

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectColor, setEditProjectColor] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');

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

  const handleEditProject = async () => {
    if (!editingProject || editProjectName.trim() === '') {
      showNotification('error', 'Campo requerido', 'El nombre del proyecto no puede estar vacío.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editProjectName,
          color: editProjectColor,
          description: editProjectDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el proyecto');
      }

      // Update the project in the local state
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? { ...project, name: editProjectName, color: editProjectColor, description: editProjectDescription }
          : project
      ));

      setEditingProject(null);
      setEditProjectName('');
      setEditProjectColor('');
      setEditProjectDescription('');
      showNotification('success', 'Proyecto actualizado', 'El proyecto se ha actualizado exitosamente.');
    } catch (error) {
      console.error('Error updating project:', error);
      showNotification('error', 'Error al actualizar', 'Ocurrió un error al actualizar el proyecto. Inténtalo de nuevo.');
    }
  };

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
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              margin: '0 0 1rem 0',
              textAlign: 'left',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Mis Proyectos
            </h2>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2.5rem',
            padding: '0 1rem'
          }}>
            <div className="add-project" style={{
              maxWidth: '50rem',
              width: '100%',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                placeholder="Nombre del nuevo proyecto"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  flex: '1',
                  minWidth: '235px',
                  padding: '12px 16px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  height: '48px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                }}
              />
              
              <input
                type="text"
                placeholder="Descripción del proyecto (opcional)"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '300px',
                  padding: '12px 16px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  height: '48px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4a90e2';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                }}
              />
              
              <div className="color-selector-container" style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div 
                  className="color-preview" 
                  style={{ 
                    backgroundColor: selectedColor,
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid #e1e8ed'
                  }}
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
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#4a90e2',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  height: '48px',
                  minWidth: '140px',
                  boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#357abd';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#4a90e2';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.3)';
                }}
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
                  className="project-card"
                  onClick={() => navigateToProjectTasks(project.name)}
                  style={{
                    backgroundColor: '#dae6f7ff',
                    border: '3px solid #0f98faff',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-16px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div 
                    className="project-color-bar" 
                    style={{ 
                      backgroundColor: project.color,
                      height: '10px',
                      borderRadius: '8px',
                      marginBottom: '6px'
                    }}
                  ></div>
                  <div className="project-content">
                    <div className="project-header-content" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div style={{ flex: 1, marginRight: '25px' }}>
                        <h3 style={{
                          margin: 0,
                          fontSize: '20px',
                          fontWeight: '800',
                          color: '#2c3e50',
                          marginBottom: project.description ? '15px' : '0',
                          lineHeight: '1.2',
                          textAlign: 'left'
                        }}>
                          {project.name}
                        </h3>
                        {project.description && (
                          <p style={{
                            margin: 0,
                            fontSize: '16px',
                            color: '#4d5661ff',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textAlign: 'left'
                          }}>
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button
                          className="info-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltip(activeTooltip === project.id ? null : project.id);
                          }}
                          aria-label="Mostrar información del proyecto"
                          style={{
                            background: 'rgba(108, 117, 125, 0.1)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: '#434f5aff',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(108, 117, 125, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(108, 117, 125, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
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
                            setEditProjectName(project.name);
                            setEditProjectColor(project.color);
                            setEditProjectDescription(project.description || '');
                          }}
                          aria-label="Editar proyecto"
                          style={{
                            background: 'rgba(192, 211, 233, 0.77)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: '#1d3147ff',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px'
                          }}
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
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999,
                            backgroundColor: 'transparent'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltip(null);
                          }}
                        />
                        
                        <div className="project-info-tooltip" style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: '#fffdfdff',
                          color: '#333',
                          padding: '24px',
                          borderRadius: '16px',
                          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                          zIndex: 1000,
                          width: '280px',
                          height: '245',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          backdropFilter: 'blur(10px)',
                          animation: 'fadeIn 0.2s ease-out',
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(null);
                            }}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: 'rgba(160, 148, 148, 0.36)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#f30a0aff',
                              transition: 'all 0.2s ease',
                              width: '32px',
                              height: '32px'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.57)';
                              e.currentTarget.style.color = '#f71313ff';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'rgba(160, 148, 148, 0.36)';
                              e.currentTarget.style.color = '#f30a0aff';
                            }}
                            aria-label="Cerrar información"
                          >
                            <svg 
                              width="25" 
                              height="25" 
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
                          
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{
                              margin: '0 0 16px 0',
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#000000ff',
                              textAlign: 'left'
                            }}>
                              Información del Proyecto
                            </h4>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#3b82f6',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}>
                                {project.createdBy.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  margin: 0,
                                  fontSize: '11px',
                                  color: '#5d6472ff',
                                  fontWeight: '500',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Creado por
                                </p>
                                <p style={{
                                  margin: 0,
                                  fontSize: '12px',
                                  color: '#0e3e81ff',
                                  fontWeight: '600'
                                }}>
                                  {project.createdBy}
                                </p>
                              </div>
                            </div>
                            
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#10b981',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}>
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
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  margin: 0,
                                  fontSize: '11px',
                                  color: '#4b525fff',
                                  fontWeight: '500',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Fecha de creación
                                </p>
                                <p style={{
                                  margin: 0,
                                  fontSize: '13px',
                                  color: '#133058ff',
                                  fontWeight: '600'
                                }}>
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

        {editingProject && (
          <>
            {/* Modal Overlay */}
            <div 
              className="modal-overlay"
              onClick={() => setEditingProject(null)}
              style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          padding: '20px',
          boxSizing: 'border-box'
              }}
            >
              {/* Modal Content */}
              <div 
          className="edit-project-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            width: '90%',
            maxWidth: '480px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            animation: 'modalSlideIn 0.3s ease-out',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
              >
          {/* Close Button */}
          <button
            onClick={() => setEditingProject(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              transition: 'all 0.2s ease',
              width: '40px',
              height: '40px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Cerrar"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Modal Header */}
          <div style={{ marginBottom: '32px', paddingRight: '60px' }}>
            <h3 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1e293b, #475569)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}>
              Editar Proyecto
            </h3>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Modifica los detalles de tu proyecto
            </p>
          </div>

          {/* Form Fields */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Nombre del proyecto
            </label>
            <input
              type="text"
              placeholder="Ingresa el nombre del proyecto"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e5e7eb',
                color: '#1f2937',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Descripción del proyecto
            </label>
            <textarea
              placeholder="Describe tu proyecto (opcional)"
              value={editProjectDescription}
              onChange={(e) => setEditProjectDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e5e7eb',
                color: '#1f2937',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              marginBottom: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Color del proyecto
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
              gap: '12px',
              maxWidth: '400px'
            }}>
              {colorOptions.map((color) => (
                <div
            key={color}
            style={{
              backgroundColor: color,
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: editProjectColor === color ? '3px solid #1f2937' : '2px solid #ffffff',
              transition: 'all 0.2s ease',
              boxShadow: editProjectColor === color 
                ? '0 0 0 2px rgba(31, 41, 55, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)' 
                : '0 4px 12px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
            onClick={() => setEditProjectColor(color)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = editProjectColor === color 
                ? '0 0 0 2px rgba(31, 41, 55, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)' 
                : '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
                >
            {editProjectColor === color && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                ✓
              </div>
            )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setEditingProject(null)}
              style={{
                padding: '14px 28px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleEditProject}
              style={{
                padding: '14px 28px',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                minWidth: '160px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
            >
              Guardar Cambios
            </button>
          </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;