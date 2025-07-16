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
              margin: '0 0 2rem 0',
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
              maxWidth: '800px',
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
                  minWidth: '250px',
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
                  minWidth: '250px',
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
                    backgroundColor: '#ffffff',
                    border: '1px solid #e1e8ed',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
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
                      height: '6px',
                      borderRadius: '3px',
                      marginBottom: '16px'
                    }}
                  ></div>
                  <div className="project-content">
                    <div className="project-header-content" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div style={{ flex: 1, marginRight: '12px' }}>
                        <h3 style={{
                          margin: 0,
                          fontSize: '22px',
                          fontWeight: '700',
                          color: '#2c3e50',
                          marginBottom: project.description ? '10px' : '0',
                          lineHeight: '1.2',
                          textAlign: 'left'
                        }}>
                          {project.name}
                        </h3>
                        {project.description && (
                          <p style={{
                            margin: 0,
                            fontSize: '16px',
                            color: '#64748b',
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
                            background: 'rgba(74, 144, 226, 0.1)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: '#4a90e2',
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
                            e.currentTarget.style.background = 'rgba(74, 144, 226, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 144, 226, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          ✎
                        </button>
                      </div>
                    </div>                    {activeTooltip === project.id && (
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
                          backgroundColor: '#ffffff',
                          color: '#333',
                          padding: '24px',
                          borderRadius: '16px',
                          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                          zIndex: 1000,
                          width: '280px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          backdropFilter: 'blur(10px)',
                          animation: 'fadeIn 0.2s ease-out'
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
                              background: 'rgba(0, 0, 0, 0.05)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              padding: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6b7280',
                              transition: 'all 0.2s ease',
                              width: '28px',
                              height: '28px'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.color = '#6b7280';
                            }}
                            aria-label="Cerrar información"
                          >
                            <svg 
                              width="14" 
                              height="14" 
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
                              color: '#1f2937',
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
                                  color: '#6b7280',
                                  fontWeight: '500',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Creado por
                                </p>
                                <p style={{
                                  margin: 0,
                                  fontSize: '13px',
                                  color: '#1f2937',
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
                                  color: '#6b7280',
                                  fontWeight: '500',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Fecha de creación
                                </p>
                                <p style={{
                                  margin: 0,
                                  fontSize: '13px',
                                  color: '#1f2937',
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
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              {/* Modal Content */}
              <div 
                className="edit-project-modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '32px',
                  width: '90%',
                  maxWidth: '500px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  animation: 'modalSlideIn 0.3s ease-out',
                  position: 'relative'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setEditingProject(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Modal Header */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    Editar Proyecto
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>
                    Modifica los detalles de tu proyecto
                  </p>
                </div>

                {/* Form Fields */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#34495e'
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
                      padding: '12px 16px',
                      border: '2px solid #e1e8ed',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4a90e2';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e1e8ed';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#34495e'
                  }}>
                    Descripción del proyecto
                  </label>
                  <input
                    type="text"
                    placeholder="Describe tu proyecto (opcional)"
                    value={editProjectDescription}
                    onChange={(e) => setEditProjectDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e8ed',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4a90e2';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e1e8ed';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#34495e'
                  }}>
                    Color del proyecto
                  </label>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    {colorOptions.map((color) => (
                      <div
                        key={color}
                        style={{
                          backgroundColor: color,
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: editProjectColor === color ? '3px solid #4a90e2' : '2px solid #e1e8ed',
                          transition: 'all 0.2s ease',
                          boxShadow: editProjectColor === color ? '0 0 0 1px #4a90e2' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onClick={() => setEditProjectColor(color)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = editProjectColor === color ? '0 0 0 1px #4a90e2' : '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setEditingProject(null)}
                    style={{
                      padding: '12px 24px',
                      border: '2px solid #e1e8ed',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#7f8c8d',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#bdc3c7';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#e1e8ed';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditProject}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#4a90e2',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#357abd';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#4a90e2';
                      e.currentTarget.style.transform = 'translateY(0)';
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