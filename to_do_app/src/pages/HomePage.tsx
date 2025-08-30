/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
  };
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import useNotification from '../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import '../styles/HomePage.css';
import '../styles/ProjectSectionPage.css';

const colorOptions = [
  '#4a90e2', '#50c878', '#f39c12', '#e74c3c', '#9b59b6',
  '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b'
];

const COLORS = [
  { id: 'blue', value: '#3b82f6', name: 'Azul', gradient: 'linear-gradient(135deg, #176df8ff 0%, #255fddff 100%)' },
  { id: 'green', value: '#10b981', name: 'Verde', gradient: 'linear-gradient(135deg, #71f7caff 0%, #1ae6a5ff 100%)' },
  { id: 'red', value: '#f70b0bff', name: 'Rojo', gradient: 'linear-gradient(135deg, #f10e0eff 0%, #f10b0bff 100%)' },
  { id: 'purple', value: '#8b5cf6', name: 'Morado', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
  { id: 'orange', value: '#ee914eff', name: 'Naranja', gradient: 'linear-gradient(135deg, #f1a46dff 0%, #e77537ff 100%)' },
  { id: 'teal', value: '#14b8a6', name: 'Verde azulado', gradient: 'linear-gradient(135deg, #088b7cff 0%, #057a71ff 100%)' },
  { id: 'pink', value: '#ec4899', name: 'Rosa', gradient: 'linear-gradient(135deg, #d32af5ff 0%, #ec5096ff 100%)' },
  { id: 'indigo', value: '#696bebff', name: 'Índigo', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingProjectData, setEditingProjectData] = useState<{
    name: string;
    description: string;
    color: string;
  }>({ name: '', description: '', color: '' });
  
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
    if (!editingProjectId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${editingProjectId}`, {
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
        project.id === editingProjectId 
          ? { ...project, ...projectData }
          : project
      ));

  setEditingProjectId(null);
  setEditingProjectData({ name: '', description: '', color: '' });
  showSuccess(t('home.projectUpdated'));
    } catch (error) {
  console.error('Error updating project:', error);
  showError(t('home.projectUpdateError'));
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingProjectData({
      name: project.name,
      description: project.description || '',
      color: project.color
    });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditingProjectData({ name: '', description: '', color: '' });
  };

  const saveEditProject = async () => {
    if (!editingProjectId || !editingProjectData.name.trim()) {
      showError(t('home.projectNameRequired'));
      return;
    }

    await handleEditProject({
      name: editingProjectData.name,
      description: editingProjectData.description,
      color: editingProjectData.color
    });
  };

  const handleAddProject = async () => {
    if (newProjectName.trim() === '') {
      showError(t('home.projectNameCannotBeEmpty'));
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      showError(t('home.userIdNotFound'));
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
  showSuccess(t('home.projectCreated'));
    } catch (error) {
  console.error('Error al crear el proyecto:', error);
  showError(t('home.projectCreateError'));
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
          <h2>{t('home.dashboard')}</h2>
          <p>{t('home.description')}</p>
          
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">{t('home.activeProjects')}</span>
            </div>
          </div>
        </div>

        <div className="projects">
          <div className="projects-header">
            <h2 className="projects-header-title">
              {t('home.myProjects')}
            </h2>
          </div>

          <div className="add-project-container">
            <div className="add-project add-project-wrapper">
              <input
                type="text"
                placeholder={t('home.newProjectName')}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="project-name-input"
              />
              
              <input
                type="text"
                placeholder={t('home.newProjectDescription')}
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
                {t('home.createProject')}
              </button>
            </div>
          </div>

          <div className="project-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div 
                  key={project.id} 
                  className={`project-card project-card-custom ${editingProjectId === project.id ? 'editing' : ''}`}
                  onClick={() => editingProjectId !== project.id && navigateToProjectTasks(project.name)}
                  style={{
                    '--project-color': project.color
                  } as React.CSSProperties}
                >
                  <div 
                    className="project-color-bar" 
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <div className="project-content">
                    {editingProjectId === project.id ? (
                      // Modo edición inline
                      <div className="inline-edit-form" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-form-group">
                          <label htmlFor={`edit-name-${project.id}`}>{t('home.editTitle')}</label>
                          <input
                            type="text"
                            id={`edit-name-${project.id}`}
                            value={editingProjectData.name}
                            onChange={(e) => setEditingProjectData({...editingProjectData, name: e.target.value})}
                            placeholder={t('home.projectNamePlaceholder')}
                            maxLength={50}
                            className="inline-edit-input"
                          />
                        </div>
                        
                        <div className="inline-form-group">
                          <label htmlFor={`edit-description-${project.id}`}>{t('home.editDescription')}</label>
                          <textarea
                            id={`edit-description-${project.id}`}
                            value={editingProjectData.description}
                            onChange={(e) => setEditingProjectData({...editingProjectData, description: e.target.value})}
                            placeholder={t('home.projectDescriptionPlaceholder')}
                            rows={3}
                            maxLength={200}
                            className="inline-edit-textarea"
                          />
                        </div>
                        
                        <div className="inline-form-group">
                          <label>{t('home.projectColor')}</label>
                          <div className="inline-color-options">
                            {COLORS.map(color => (
                              <button
                                key={color.id}
                                type="button"
                                className={`inline-color-option ${editingProjectData.color === color.value ? 'selected' : ''}`}
                                style={{ background: color.gradient }}
                                onClick={() => setEditingProjectData({...editingProjectData, color: color.value})}
                                aria-label={`Color ${color.name}`}
                                aria-pressed={editingProjectData.color === color.value}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="inline-edit-actions">
                          <button
                            type="button"
                            className="inline-btn cancel-btn"
                            onClick={cancelEditProject}
                          >
                            {t('home.cancel')}
                          </button>
                          <button
                            type="button"
                            className="inline-btn save-btn"
                            onClick={saveEditProject}
                            style={{
                              background: `linear-gradient(135deg, ${editingProjectData.color}, ${editingProjectData.color}dd)`
                            }}
                          >
                            {t('home.save')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Modo vista normal
                      <>
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
                              aria-label={t('home.showProjectInfo')}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(34, 197, 94, 1)';
                                // Crear tooltip si no existe
                                if (!e.currentTarget.querySelector('.info-tooltip')) {
                                  const tooltip = document.createElement('div');
                                  tooltip.className = 'info-tooltip';
                                  tooltip.textContent = t('home.viewInfo');
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
                                startEditProject(project);
                              }}
                              aria-label={t('home.editProject')}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(74, 145, 226, 0.35)';
                                // Crear tooltip si no existe
                                if (!e.currentTarget.querySelector('.edit-tooltip')) {
                                  const tooltip = document.createElement('div');
                                  tooltip.className = 'edit-tooltip';
                                  tooltip.textContent = t('home.editProject');
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
                                aria-label={t('home.closeInfo')}
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
                                  {t('home.projectInfo')}
                                </h4>
                              </div>
                              
                              <div className="info-column-container">
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
                                      {t('home.createdAt')}
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
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
                <div className="empty-projects">
                <h3>{t('home.noProjectsTitle')}</h3>
                <p>{t('home.noProjectsText')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;