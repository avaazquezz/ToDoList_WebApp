import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useNotification } from '../hooks/useNotification';
import '../styles/ProjectSectionPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Función para ajustar el color y crear el degradado
const adjustColor = (color: string, amount: number): string => {
  return '#' + color.replace(/^#/, '').replace(/([a-f\d]{2})/gi, (_, c) => {
    const value = Math.min(Math.max(parseInt(c, 16) + amount, 0), 255);
    return value.toString(16).padStart(2, '0');
  });
};

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

interface Section {
  idSection: number;
  title: string;
  text: string;
  color: string;
  createdAt: number;
  gradient?: string;
}

interface Project {
  id: number;
  name: string;
  color: string;
  createdBy: string;
  createdAt: number;
}

const ProjectSectionsPage = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionData, setEditingSectionData] = useState<{
    title: string;
    text: string;
    color: string;
  }>({ title: '', text: '', color: '' });
  const [deletingSectionId, setDeletingSectionId] = useState<number | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionData, setNewSectionData] = useState<{
    title: string;
    text: string;
    color: string;
  }>({ title: '', text: '', color: COLORS[0].value });
  const [projectColor, setProjectColor] = useState('');
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();

  const decodedProjectName = projectName ? decodeURIComponent(projectName) : '';

  // Cargar color del proyecto
  useEffect(() => {
    if (!decodedProjectName) return;
    try {
      const storedProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
      const currentProject = storedProjects.find(p => p.name === decodedProjectName);
      if (currentProject?.color) {
        setProjectColor(currentProject.color);
      }
    } catch (error) {
      showError('Error al cargar la configuración del proyecto');
    }
  }, [decodedProjectName]);

  // Cargar secciones desde el backend
  useEffect(() => {
    if (!decodedProjectName) return;
    const fetchSections = async () => {
      try {
        const storedProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
        const currentProject = storedProjects.find(p => p.name === decodedProjectName);
        if (!currentProject) {
          showError('No se encontró el proyecto en localStorage');
          return;
        }
        const response = await fetch(`${API_BASE_URL}/project/${currentProject.id}/sections`);
        if (!response.ok) throw new Error('Error al cargar las secciones');
        const data = await response.json();
        setSections(data.map(section => ({
          idSection: section.idSection,
          title: section.title,
          text: section.description, // Corrected field name from 'text' to 'description'
          color: section.color,
          gradient: COLORS.find(c => c.value === section.color)?.gradient || '',
          createdAt: section.createdAt,
        })));
      } catch (error) {
        showError('Error al cargar las secciones del proyecto');
      }
    };
    fetchSections();
  }, [decodedProjectName]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      const currentProject = parsedProjects.find(p => p.name === decodedProjectName);
      if (currentProject) {
        const storedSections = localStorage.getItem(`sections_${currentProject.id}`);
        if (storedSections) {
          setSections(JSON.parse(storedSections));
        }
      }
    }
  }, [decodedProjectName]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      const currentProject = parsedProjects.find(p => p.name === decodedProjectName);
      if (currentProject) {
        localStorage.setItem(`sections_${currentProject.id}`, JSON.stringify(sections));
      }
    }
  }, [sections]);

  const startInlineEdit = (section: Section) => {
    setEditingSectionId(section.idSection);
    setEditingSectionData({
      title: section.title,
      text: section.text,
      color: section.color
    });
  };

  const cancelInlineEdit = () => {
    setEditingSectionId(null);
    setEditingSectionData({ title: '', text: '', color: '' });
  };

  const cancelInlineDelete = () => {
    setDeletingSectionId(null);
  };

  const startInlineCreate = () => {
    setIsCreatingSection(true);
    setNewSectionData({ title: '', text: '', color: COLORS[0].value });
  };

  const cancelInlineCreate = () => {
    setIsCreatingSection(false);
    setNewSectionData({ title: '', text: '', color: COLORS[0].value });
  };

  const saveInlineCreate = async () => {
    if (!newSectionData.title.trim() || !newSectionData.text.trim()) {
      showWarning('Por favor, completa todos los campos');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      showError('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente');
      navigate('/login');
      return;
    }

    try {
      const storedProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
      const currentProject = storedProjects.find(p => p.name === decodedProjectName);
      
      if (!currentProject) {
        showError('No se encontró el proyecto');
        return;
      }

      const selectedColorObj = COLORS.find(c => c.value === newSectionData.color);

      const response = await fetch(`${API_BASE_URL}/project/${currentProject.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSectionData.title,
          description: newSectionData.text,
          color: newSectionData.color,
          createdAt: Date.now(),
          project_id: currentProject.id,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear la sección: ${errorText}`);
      }

      const data = await response.json();
      
      // Agregar la nueva sección al estado
      setSections(prev => [
        ...prev,
        {
          idSection: data.idSection,
          title: newSectionData.title,
          text: newSectionData.text,
          color: newSectionData.color,
          gradient: selectedColorObj?.gradient,
          createdAt: Date.now(),
        }
      ]);

      showSuccess('Sección creada correctamente');
      cancelInlineCreate();
    } catch (error) {
      showError('Error al crear la sección');
    }
  };

  const saveInlineEdit = async () => {
    if (!editingSectionId || !editingSectionData.title.trim() || !editingSectionData.text.trim()) {
      showWarning('Por favor, completa todos los campos');
      return;
    }

    try {
      const storedProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
      const currentProject = storedProjects.find(p => p.name === decodedProjectName);
      
      if (!currentProject) {
        showError('No se encontró el proyecto');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/sections/${editingSectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingSectionData.title,
          description: editingSectionData.text,
          color: editingSectionData.color
        })
      });

      if (!response.ok) throw new Error('Error al actualizar la sección');

      // Actualizar el estado local
      setSections(prevSections => 
        prevSections.map(section => 
          section.idSection === editingSectionId 
            ? {
                ...section,
                title: editingSectionData.title,
                text: editingSectionData.text,
                color: editingSectionData.color,
                gradient: COLORS.find(c => c.value === editingSectionData.color)?.gradient || ''
              }
            : section
        )
      );

      showSuccess('Sección actualizada correctamente');
      cancelInlineEdit();
    } catch (error) {
      showError('Error al actualizar la sección');
    }
  };



  const editSection = (section: Section) => {
    startInlineEdit(section);
  };

  const deleteSection = async (sectionId: number) => {
    setDeletingSectionId(sectionId);
  };

  const confirmDeleteSection = async (sectionId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar la sección');
      setSections(prev => prev.filter(s => s.idSection !== sectionId));
      setDeletingSectionId(null);
      showSuccess('Sección eliminada correctamente');
    } catch (error) {
      showError('Error al eliminar la sección');
    }
  };

  const deleteProject = async () => {
    setIsDeletingProject(true);
  };

  const confirmDeleteProject = async () => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const currentProject = storedProjects.find((p: Project) => p.name === decodedProjectName);
      if (!currentProject) {
        showError('No se encontró el proyecto. Por favor, verifica los datos');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/projects/${currentProject.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el proyecto');
      const updatedProjects = storedProjects.filter((p: Project) => p.name !== decodedProjectName);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setIsDeletingProject(false);
      showSuccess('Proyecto eliminado correctamente');
      navigate('/home');
    } catch (error) {
      showError('Error al eliminar el proyecto');
    }
  };

  const cancelDeleteProject = () => {
    setIsDeletingProject(false);
  };

  return (
    <div className="project-page-container">
      <NavBar />

      <div className="project-main-content">
        <div
          className="project-header project-header-dynamic"
          style={{
            background: projectColor
              ? `linear-gradient(135deg, ${projectColor}, ${adjustColor(projectColor, -30)})`
              : 'var(--gradient-primary)'
          }}
        >
          {isDeletingProject ? (
            <div className="inline-delete-project-form">
              <div className="inline-delete-header">
                <div className="inline-delete-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </div>
                <h2 className="inline-delete-title">Eliminar Proyecto</h2>
              </div>
              
              <div className="inline-delete-content">
                <p className="inline-delete-question">
                  ¿Estás seguro que deseas eliminar el proyecto <strong>"{decodedProjectName}"</strong>?
                </p>
                
                <div className="inline-delete-warning">
                  <div className="inline-delete-warning-icon">!</div>
                  <div className="inline-delete-warning-text">
                    <strong>Esta acción eliminará permanentemente:</strong>
                    <ul>
                      <li>El proyecto completo</li>
                      <li>Todas las secciones</li>
                      <li>Todos los datos asociados</li>
                    </ul>
                    <p><strong>Esta acción no se puede deshacer.</strong></p>
                  </div>
                </div>
              </div>
              
              <div className="inline-delete-actions">
                <button
                  className="inline-btn cancel-btn"
                  onClick={cancelDeleteProject}
                >
                  Cancelar
                </button>
                <button
                  className="inline-btn delete-btn-confirm"
                  onClick={confirmDeleteProject}
                >
                  Eliminar Proyecto
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1>{decodedProjectName}</h1>
              <p>Organiza tu proyecto en secciones para una mejor gestión de tareas</p>
              <div className="project-top-btn">
                <button
                  className="add-section-button"
                  onClick={startInlineCreate}
                  aria-label="Crear nueva sección"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Nueva Sección
                </button>
              </div>
            </>
          )}
        </div>

        <div className="sections-list">
          {(sections.length > 0 || isCreatingSection) ? (
            <div className="section-cards">
              {/* Div de creación inline - aparece al principio */}
              {isCreatingSection && (
                <div
                  className="section-card creating"
                  style={{
                    background: `linear-gradient(to bottom right, ${newSectionData.color}15, ${newSectionData.color}08)`,
                    borderColor: `${newSectionData.color}30`,
                    '--project-color': projectColor || 'var(--primary-color)'
                  } as React.CSSProperties}
                >
                  <div className="inline-edit-form" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-form-group">
                      <label htmlFor="create-title">Título</label>
                      <input
                        type="text"
                        id="create-title"
                        value={newSectionData.title}
                        onChange={(e) => setNewSectionData({...newSectionData, title: e.target.value})}
                        placeholder="Título de la sección"
                        maxLength={50}
                        className="inline-edit-input"
                        autoFocus
                      />
                    </div>
                    
                    <div className="inline-form-group">
                      <label htmlFor="create-text">Descripción</label>
                      <textarea
                        id="create-text"
                        value={newSectionData.text}
                        onChange={(e) => setNewSectionData({...newSectionData, text: e.target.value})}
                        placeholder="Descripción de la sección"
                        rows={3}
                        maxLength={200}
                        className="inline-edit-textarea"
                      />
                    </div>
                    
                    <div className="inline-form-group">
                      <label>Color de la sección</label>
                      <div className="inline-color-options">
                        {COLORS.map(color => (
                          <button
                            key={color.id}
                            type="button"
                            className={`inline-color-option ${newSectionData.color === color.value ? 'selected' : ''}`}
                            style={{ background: color.gradient }}
                            onClick={() => setNewSectionData({...newSectionData, color: color.value})}
                            aria-label={`Color ${color.name}`}
                            aria-pressed={newSectionData.color === color.value}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="inline-edit-actions">
                      <button
                        type="button"
                        className="inline-btn cancel-btn"
                        onClick={cancelInlineCreate}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="inline-btn save-btn"
                        onClick={saveInlineCreate}
                      >
                        Crear
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Secciones existentes */}
              {sections.map(section => (
                <div
                  key={section.idSection}
                  className={`section-card ${editingSectionId === section.idSection ? 'editing' : ''} ${deletingSectionId === section.idSection ? 'deleting' : ''}`}
                  style={{
                    background: `linear-gradient(to bottom right, ${section.color}15, ${section.color}08)`,
                    borderColor: `${section.color}30`,
                    '--project-color': projectColor || 'var(--primary-color)'
                  } as React.CSSProperties}
                  role="article"
                  aria-labelledby={"section-title-" + section.idSection}
                  onClick={() => editingSectionId !== section.idSection && deletingSectionId !== section.idSection && navigate(`/project/${decodedProjectName}/sections/${section.idSection}/todos`, { state: { sectionName: section.title } })}
                >
                  {editingSectionId === section.idSection ? (
                    // Modo edición inline
                    <div className="inline-edit-form" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-form-group">
                        <label htmlFor={`edit-title-${section.idSection}`}>Título</label>
                        <input
                          type="text"
                          id={`edit-title-${section.idSection}`}
                          value={editingSectionData.title}
                          onChange={(e) => setEditingSectionData({...editingSectionData, title: e.target.value})}
                          placeholder="Título de la sección"
                          maxLength={50}
                          className="inline-edit-input"
                        />
                      </div>
                      
                      <div className="inline-form-group">
                        <label htmlFor={`edit-text-${section.idSection}`}>Descripción</label>
                        <textarea
                          id={`edit-text-${section.idSection}`}
                          value={editingSectionData.text}
                          onChange={(e) => setEditingSectionData({...editingSectionData, text: e.target.value})}
                          placeholder="Descripción de la sección"
                          rows={3}
                          maxLength={200}
                          className="inline-edit-textarea"
                        />
                      </div>
                      
                      <div className="inline-form-group">
                        <label>Color de la sección</label>
                        <div className="inline-color-options">
                          {COLORS.map(color => (
                            <button
                              key={color.id}
                              type="button"
                              className={`inline-color-option ${editingSectionData.color === color.value ? 'selected' : ''}`}
                              style={{ background: color.gradient }}
                              onClick={() => setEditingSectionData({...editingSectionData, color: color.value})}
                              aria-label={`Color ${color.name}`}
                              aria-pressed={editingSectionData.color === color.value}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="inline-edit-actions">
                        <button
                          type="button"
                          className="inline-btn cancel-btn"
                          onClick={cancelInlineEdit}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="inline-btn save-btn"
                          onClick={saveInlineEdit}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : deletingSectionId === section.idSection ? (
                    // Modo eliminación inline
                    <div className="inline-delete-form" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-delete-header">
                        <div className="inline-delete-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h4 className="inline-delete-title">Eliminar Sección</h4>
                      </div>
                      
                      <div className="inline-delete-content">
                        <p className="inline-delete-question">
                          ¿Estás seguro de que deseas eliminar la sección <strong>"{section.title}"</strong>?
                        </p>
                        <div className="inline-delete-warning">
                          <div className="inline-delete-warning-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="inline-delete-warning-text">
                            Esta acción no se puede deshacer y se perderán todos los datos asociados.
                          </span>
                        </div>
                      </div>
                      
                      <div className="inline-delete-actions">
                        <button
                          type="button"
                          className="inline-btn cancel-btn"
                          onClick={cancelInlineDelete}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="inline-btn delete-btn-confirm"
                          onClick={() => confirmDeleteSection(section.idSection)}
                        >
                          Eliminar Sección
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo vista normal
                    <>
                      <h3 className="section-title" id={"section-title-" + section.idSection}>
                        {section.title}
                      </h3>
                      <p className="section-text">{section.text}</p>
                      <div className="section-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={(e) => { e.stopPropagation(); editSection(section); }}
                          aria-label={"Editar sección " + section.title}
                        >
                          Editar
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={(e) => { e.stopPropagation(); deleteSection(section.idSection); }}
                          aria-label={"Eliminar sección " + section.title}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : !isCreatingSection ? (
            <div className="empty-sections" role="status">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <p>No hay secciones en este proyecto.</p>
              <p>¡Comienza creando tu primera sección!</p>
            </div>
          ) : null}
        </div>

        <div className="project-bottom-actions">
          <button
            className="delete-project-button"
            onClick={deleteProject}
            aria-label={"Eliminar proyecto " + decodedProjectName}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-with-margin" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Eliminar Proyecto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSectionsPage;
