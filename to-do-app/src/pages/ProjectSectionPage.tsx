import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useNotification } from '../hooks/useNotification';
import '../styles/ProjectSectionPage.css';

const API_BASE_URL = 'http://localhost:3001/api';

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
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionText, setNewSectionText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [projectColor, setProjectColor] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'delete-section' | 'delete-project';
    onConfirm: () => void;
    targetId?: number;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'delete-section',
    onConfirm: () => {},
  });
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

  const closeModal = () => {
    setIsDialogOpen(false);
    setEditingSection(null);
    setNewSectionTitle('');
    setNewSectionText('');
    setSelectedColor(COLORS[0].value);
  };

  const addOrUpdateSection = async () => {
    if (newSectionTitle.trim() === '' || newSectionText.trim() === '') {
      showWarning('Por favor completa todos los campos requeridos');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showError('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente');
      navigate('/login');
      return;
    }
    const selectedColorObj = COLORS.find(c => c.value === selectedColor);
    try {
      if (editingSection) {
        // UPDATE
        const response = await fetch(`${API_BASE_URL}/sections/${editingSection.idSection}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newSectionTitle,
            description: newSectionText,
            color: selectedColor,
            user_id: userId,
          }),
        });
        if (!response.ok) throw new Error('Error al actualizar la sección');
        setSections(prev => prev.map(section =>
          section.idSection === editingSection.idSection
            ? { ...section, title: newSectionTitle, text: newSectionText, color: selectedColor, gradient: selectedColorObj?.gradient }
            : section
        ));
        showSuccess('Sección actualizada correctamente');
      } else {
        // CREATE
        const storedProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
        const currentProject = storedProjects.find(p => p.name === decodedProjectName);
        if (!currentProject) {
          showError('No se encontró el proyecto. Por favor, verifica los datos');
          return;
        }
        console.log('📤 Enviando datos:', {
          title: newSectionTitle,
          description: newSectionText, 
          color: selectedColor,
          createdAt: Date.now(),
          project_id: currentProject.id,
          user_id: userId,
        });
        
        const response = await fetch(`${API_BASE_URL}/project/${currentProject.id}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newSectionTitle,
            description: newSectionText, 
            color: selectedColor,
            createdAt: Date.now(),
            project_id: currentProject.id,
            user_id: userId,
          }),
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Error response:', errorText);
          throw new Error(`Error al crear la sección: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Success data:', data);
        setSections(prev => [
          ...prev,
          {
            idSection: data.idSection,
            title: newSectionTitle,
            text: newSectionText,
            color: selectedColor,
            gradient: selectedColorObj?.gradient,
            createdAt: Date.now(),
          }
        ]);
        showSuccess('Sección creada correctamente');
      }
      closeModal();
    } catch (error) {
      console.error('💥 Catch error:', error);
      showError(editingSection ? 'Error al actualizar la sección' : 'Error al crear la sección');
    }
  };

  const editSection = (section: Section) => {
    setEditingSection(section); // Pass section directly without spreading
    setNewSectionTitle(section.title || ''); // Ensure title is set
    setNewSectionText(section.text || ''); // Ensure text is set
    setSelectedColor(section.color || COLORS[0].value); // Default to first color if undefined
    setIsDialogOpen(true); // Open the modal
  };

  const deleteSection = async (sectionId: number) => {
    const sectionToDelete = sections.find(s => s.idSection === sectionId);
    if (sectionToDelete) {
      setConfirmDialog({
        isOpen: true,
        title: 'Eliminar Sección',
        message: `¿Estás seguro de que deseas eliminar la sección "${sectionToDelete.title}"?\n\nEsta acción no se puede deshacer y se perderán todos los datos asociados.`,
        type: 'delete-section',
        targetId: sectionId,
        onConfirm: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar la sección');
            setSections(prev => prev.filter(s => s.idSection !== sectionId));
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            showSuccess('Sección eliminada correctamente');
          } catch (error) {
            showError('Error al eliminar la sección');
          }
        }
      });
    }
  };

  const deleteProject = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Proyecto',
      message: `¿Estás seguro que deseas eliminar el proyecto "${decodedProjectName}"?\n\nEsta acción eliminará permanentemente:\n• El proyecto completo\n• Todas las secciones\n• Todos los datos asociados\n\n⚠️ Esta acción no se puede deshacer.`,
      type: 'delete-project',
      onConfirm: async () => {
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
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          showSuccess('Proyecto eliminado correctamente');
          navigate('/home');
        } catch (error) {
          showError('Error al eliminar el proyecto');
        }
      }
    });
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
          <h1>{decodedProjectName}</h1>
          <p>Organiza tu proyecto en secciones para una mejor gestión de tareas</p>
          <div className="project-top-btn">
            <button
              className="add-section-button"
              onClick={() => setIsDialogOpen(true)}
              aria-label="Crear nueva sección"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nueva Sección
            </button>
          </div>
        </div>

        <div className="sections-list">
          {sections.length > 0 ? (
            <div className="section-cards">
              {sections.map(section => (
                <div
                  key={section.idSection}
                  className="section-card"
                  style={{
                    background: `linear-gradient(to bottom right, ${section.color}15, ${section.color}08)`,
                    borderColor: `${section.color}30`,
                    '--project-color': projectColor || 'var(--primary-color)'
                  } as React.CSSProperties}
                  role="article"
                  aria-labelledby={"section-title-" + section.idSection}
                  onClick={() => navigate(`/project/${decodedProjectName}/sections/${section.idSection}/todos`, { state: { sectionName: section.title } })}
                >
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
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-sections" role="status">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <p>No hay secciones en este proyecto.</p>
              <p>¡Comienza creando tu primera sección!</p>
            </div>
          )}
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

        {isDialogOpen && (
          <div
            className="modal-overlay"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 id="modal-title" className="modal-title">
                  {editingSection ? 'Editar Sección' : 'Nueva Sección'}
                </h2>
                <p className="modal-subtitle">
                  {editingSection
                    ? 'Modifica los detalles de la sección'
                    : 'Crea una nueva sección para organizar tus tareas'
                  }
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="sectionTitle">Título</label>
                <input
                  type="text"
                  id="sectionTitle"
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  placeholder="Escribe un título descriptivo"
                  maxLength={50}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sectionText">Descripción</label>
                <textarea
                  id="sectionText"
                  value={newSectionText}
                  onChange={e => setNewSectionText(e.target.value)}
                  placeholder="Describe el propósito de esta sección"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label>Color de la sección</label>
                <div className="color-options">
                  {COLORS.map(color => (
                    <button
                      key={color.id}
                      className={"color-option " + (selectedColor === color.value ? 'selected' : '')}
                      style={{ background: color.gradient }}
                      onClick={() => setSelectedColor(color.value)}
                      aria-label={"Color " + color.name}
                      aria-pressed={selectedColor === color.value}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn cancel-button"
                  onClick={closeModal}
                >Cancelar</button>
                <button
                  className="modal-btn create-button"
                  onClick={addOrUpdateSection}
                  disabled={!newSectionTitle.trim() || !newSectionText.trim()}
                >
                  {editingSection ? 'Guardar Cambios' : 'Crear Sección'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación */}
        {confirmDialog.isOpen && (
          <div
            className="modal-overlay"
            onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
          >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 id="confirm-modal-title" className="modal-title">
                  {confirmDialog.title}
                </h2>
                <p className="modal-subtitle">
                  {confirmDialog.type === 'delete-project' 
                    ? 'Esta acción eliminará permanentemente el proyecto y todos sus datos'
                    : 'Esta acción eliminará permanentemente la sección'
                  }
                </p>
              </div>

              <div className="form-group">
                <div className="warning-message">
                  <div className="warning-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>
                  <p className="warning-text">
                    {confirmDialog.message}
                  </p>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn cancel-button"
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                >
                  Cancelar
                </button>
                <button
                  className="modal-btn delete-button"
                  onClick={confirmDialog.onConfirm}
                >
                  {confirmDialog.type === 'delete-project' ? 'Eliminar Proyecto' : 'Eliminar Sección'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSectionsPage;
